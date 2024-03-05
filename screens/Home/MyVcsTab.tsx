import React, {useEffect, useState} from 'react';
import {Button, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Pressable, RefreshControl} from 'react-native';
import {useMyVcsTab} from './MyVcsTabController';
import {HomeScreenTabProps} from './HomeScreen';
import {AddVcModal} from './MyVcs/AddVcModal';
import {GetVcModal} from './MyVcs/GetVcModal';
import {useTranslation} from 'react-i18next';
import {GET_INDIVIDUAL_ID} from '../../shared/constants';
import {
  ErrorMessageOverlay,
  MessageOverlay,
} from '../../components/MessageOverlay';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {BannerNotification} from '../../components/BannerNotification';
import {
  getErrorEventData,
  sendErrorEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';

import {Error} from '../../components/ui/Error';
import {useIsFocused} from '@react-navigation/native';
import {getVCsOrderedByPinStatus} from '../../shared/Utils';
import {SvgImage} from '../../components/ui/svg';
import {SearchBar} from '../../components/ui/SearchBar';
import {Icon} from 'react-native-elements';
import {VCMetadata} from '../../shared/VCMetadata';

export const MyVcsTab: React.FC<HomeScreenTabProps> = props => {
  const {t} = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);
  const storeErrorTranslationPath = 'errors.savingFailed';
  const vcMetadataOrderedByPinStatus = getVCsOrderedByPinStatus(
    controller.vcMetadatas,
  );
  const vcData = controller.vcData;
  const [clearSearchIcon, setClearSearchIcon] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredSearchData, setFilteredSearchData] = useState<
    Array<Record<string, VCMetadata>>
  >([]);
  const [showPinVc, setShowPinVc] = useState(true);

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
  };

  const clearIndividualId = () => {
    GET_INDIVIDUAL_ID({id: '', idType: 'UIN'});
  };

  const onFocusSearch = () => {
    setShowPinVc(false);
  };

  const clearSearchText = () => {
    filterVcs('');
    setClearSearchIcon(false);
    setShowPinVc(true);
  };

  const filterVcs = (searchText: string) => {
    setSearch(searchText);
    setFilteredSearchData([]);
    const searchTextLower = searchText.toLowerCase();
    const filteredData: Array<Record<string, VCMetadata>> = [];

    for (const [key, value] of Object.entries(vcData)) {
      const searchTextFound = searchNestedObject(searchTextLower, value);
      if (searchTextFound) {
        filteredData.push({[key]: value['vcMetadata']});
      }
    }
    setFilteredSearchData(filteredData);

    if (searchText !== '') {
      setClearSearchIcon(true);
      setShowPinVc(false);
    } else {
      setClearSearchIcon(false);
    }
  };

  const searchNestedObject = (searchText: string, obj: any): boolean => {
    for (const val of Object.values(obj)) {
      if (typeof val === 'string' && val.toLowerCase().includes(searchText)) {
        return true;
      } else if (typeof val === 'object' && val !== null) {
        if (searchNestedObject(searchText, val)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (controller.areAllVcsLoaded) {
      controller.RESET_STORE_VC_ITEM_STATUS();
      controller.RESET_ARE_ALL_VCS_DOWNLOADED();
    }
    if (controller.inProgressVcDownloads?.size > 0) {
      controller.SET_STORE_VC_ITEM_STATUS();
    }

    if (controller.showHardwareKeystoreNotExistsAlert) {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.appOnboarding,
          TelemetryConstants.ErrorId.doesNotExist,
          TelemetryConstants.ErrorMessage.hardwareKeyStore,
        ),
      );
    }

    if (controller.isTampered) {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.appLogin,
          TelemetryConstants.ErrorId.vcsAreTampered,
          TelemetryConstants.ErrorMessage.vcsAreTampered,
        ),
      );
    }
  }, [
    controller.areAllVcsLoaded,
    controller.inProgressVcDownloads,
    controller.isTampered,
  ]);

  let failedVCsList = [];
  controller.downloadFailedVcs.forEach(vc => {
    failedVCsList.push(`\n${vc.idType}:${vc.id}`);
  });

  const isVerificationFailed = controller.verificationErrorMessage !== '';

  const verificationErrorMessage = t(
    `errors.verificationFailed.${controller.verificationErrorMessage}`,
  );

  const downloadFailedVcsErrorMessage = `${t(
    'errors.downloadLimitExpires.message',
  )}${failedVCsList}`;

  const isDownloadFailedVcs =
    useIsFocused() &&
    controller.downloadFailedVcs.length >= 1 &&
    !controller.AddVcModalService &&
    !controller.GetVcModalService;
  const numberOfCardsAvailable =
    filteredSearchData.length > 1
      ? filteredSearchData.length
      : controller.vcMetadatas.length;

  const cardsAvailableText =
    numberOfCardsAvailable > 1
      ? numberOfCardsAvailable + ' ' + t('common:cards')
      : numberOfCardsAvailable + ' ' + t('common:card');
  return (
    <React.Fragment>
      <Column fill style={{display: props.isVisible ? 'flex' : 'none'}}>
        {controller.isRequestSuccessful && (
          <BannerNotification
            type="success"
            message={t('downloadingYourCard')}
            onClosePress={() => {
              controller.RESET_STORE_VC_ITEM_STATUS();
              clearIndividualId();
            }}
            key={'downloadingVcPopup'}
            testId={'downloadingVcPopup'}
          />
        )}
        <Column fill pY={2} pX={8}>
          {vcMetadataOrderedByPinStatus.length > 0 && (
            <React.Fragment>
              <Column
                scroll
                margin="0 0 20 0"
                padding="0 0 100 0"
                backgroundColor={Theme.Colors.lightGreyBackgroundColor}
                refreshControl={
                  <RefreshControl
                    refreshing={controller.isRefreshingVcs}
                    onRefresh={controller.REFRESH}
                  />
                }>
                <Row style={Theme.SearchBarStyles.vcSearchBarContainer}>
                  <SearchBar
                    isVcSearch
                    searchIconTestID="searchIssuerIcon"
                    searchBarTestID="issuerSearchBar"
                    search={search}
                    placeholder={t('searchByName')}
                    onFocus={onFocusSearch}
                    onChangeText={filterVcs}
                    onLayout={() => filterVcs('')}
                  />
                  {clearSearchIcon && (
                    <Pressable onPress={clearSearchText}>
                      <Icon
                        testID="clearingIssuerSearchIcon"
                        name="circle-with-cross"
                        type="entypo"
                        size={15}
                        color={Theme.Colors.DetailsLabel}
                      />
                    </Pressable>
                  )}
                </Row>
                <Row pY={11} pX={8}>
                  {numberOfCardsAvailable > 0 && (
                    <Text style={{fontFamily: 'Inter_500Medium'}}>
                      {cardsAvailableText}
                    </Text>
                  )}
                </Row>
                {showPinVc &&
                  vcMetadataOrderedByPinStatus.map(vcMetadata => {
                    return (
                      <VcItemContainer
                        key={vcMetadata.getVcKey()}
                        vcMetadata={vcMetadata}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                        isDownloading={controller.inProgressVcDownloads?.has(
                          vcMetadata.getVcKey(),
                        )}
                        isPinned={vcMetadata.isPinned}
                      />
                    );
                  })}

                {filteredSearchData.length > 0 && !showPinVc
                  ? filteredSearchData.map(vcMetadataObj => {
                      const [vcKey, vcMetadata] =
                        Object.entries(vcMetadataObj)[0];
                      return (
                        <VcItemContainer
                          key={vcKey}
                          vcMetadata={vcMetadata}
                          margin="0 2 8 2"
                          onPress={controller.VIEW_VC}
                          isDownloading={controller.inProgressVcDownloads?.has(
                            vcKey,
                          )}
                          isPinned={vcMetadata.isPinned}
                        />
                      );
                    })
                  : filteredSearchData.length === 0 &&
                    search &&
                    !showPinVc && (
                      <Column
                        fill
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingTop: 170,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 18,
                            fontFamily: 'Inter_600SemiBold',
                          }}>
                          {t('noCardsTitle')}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            lineHeight: 17,
                            paddingTop: 10,
                            fontSize: 14,
                            fontFamily: 'Inter_400Regular',
                          }}>
                          {t('noCardsDescription')}
                        </Text>
                      </Column>
                    )}
              </Column>
            </React.Fragment>
          )}
          {controller.vcMetadatas.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                {SvgImage.DigitalIdentity()}
                <Text
                  testID="bringYourDigitalID"
                  style={{paddingTop: 3}}
                  align="center"
                  weight="bold"
                  margin="33 0 6 0"
                  lineHeight={1}>
                  {t('bringYourDigitalID')}
                </Text>
                <Text
                  style={{
                    ...Theme.TextStyles.bold,
                    paddingTop: 3,
                  }}
                  color={Theme.Colors.textLabel}
                  align="center"
                  margin="0 12 30 12">
                  {t('generateVcFABDescription')}
                </Text>
              </Column>
            </React.Fragment>
          )}
        </Column>
      </Column>

      {controller.AddVcModalService && (
        <AddVcModal service={controller.AddVcModalService} onPress={getId} />
      )}

      {controller.GetVcModalService && (
        <GetVcModal service={controller.GetVcModalService} />
      )}

      <MessageOverlay
        testID="keyStoreNotExists"
        isVisible={controller.showHardwareKeystoreNotExistsAlert}
        title={t('errors.keystoreNotExists.title')}
        message={t('errors.keystoreNotExists.message')}
        onButtonPress={controller.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS}
        buttonText={t('errors.keystoreNotExists.riskOkayText')}
        minHeight={'auto'}>
        <Row>
          <Button
            testID="ok"
            type="gradient"
            title={t('errors.keystoreNotExists.riskOkayText')}
            onPress={controller.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS}
            margin={[0, 8, 0, 0]}
          />
        </Row>
      </MessageOverlay>

      <ErrorMessageOverlay
        translationPath={'MyVcsTab'}
        isVisible={controller.isSavingFailedInIdle}
        error={storeErrorTranslationPath}
        onDismiss={controller.DISMISS}
      />
      <MessageOverlay
        isVisible={controller.isBindingError}
        title={controller.walletBindingError}
        onButtonPress={controller.DISMISS}
      />
      <MessageOverlay
        isVisible={controller.isTampered}
        title={t('errors.vcIsTampered.title')}
        message={t('errors.vcIsTampered.message')}
        onButtonPress={controller.REMOVE_TAMPERED_VCS}
        buttonText={t('common:ok')}
        minHeight={'auto'}
      />

      <MessageOverlay
        isVisible={isDownloadFailedVcs}
        title={t('errors.downloadLimitExpires.title')}
        message={downloadFailedVcsErrorMessage}
        onButtonPress={controller.DELETE_VC}
        buttonText={t('common:ok')}
        minHeight={'auto'}
      />

      {isVerificationFailed && (
        <Error
          testID="verificationError"
          isVisible={isVerificationFailed}
          isModal={true}
          alignActionsOnEnd
          title={t('errors.verificationFailed.title')}
          message={verificationErrorMessage}
          image={SvgImage.PermissionDenied()}
          showClose={false}
          primaryButtonText="goBack"
          primaryButtonEvent={controller.RESET_VERIFY_ERROR}
          primaryButtonTestID="goBack"
          customStyles={{marginTop: '30%'}}
        />
      )}

      {controller.isNetworkOff && (
        <Error
          testID="networkOffError"
          isVisible={controller.isNetworkOff}
          isModal
          title={t('errors.noInternetConnection.title')}
          message={t('errors.noInternetConnection.message')}
          onDismiss={controller.DISMISS}
          image={SvgImage.NoInternetConnection()}
          showClose
          primaryButtonText="tryAgain"
          primaryButtonEvent={controller.TRY_AGAIN}
          primaryButtonTestID="tryAgain"
        />
      )}
    </React.Fragment>
  );
};
