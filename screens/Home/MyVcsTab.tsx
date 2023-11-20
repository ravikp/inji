import React, {useEffect} from 'react';
import {Button, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Image, RefreshControl} from 'react-native';
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
import {groupBy} from '../../shared/javascript';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {BannerNotification} from '../../components/BannerNotification';
import {
  getErrorEventData,
  sendErrorEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';

import {Error} from '../../components/ui/Error';
import {useIsFocused} from '@react-navigation/native';

const pinIconProps = {iconName: 'pushpin', iconType: 'antdesign'};

export const MyVcsTab: React.FC<HomeScreenTabProps> = props => {
  const {t} = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);
  const storeErrorTranslationPath = 'errors.savingFailed';
  const [pinned, unpinned] = groupBy(
    controller.vcMetadatas,
    vcMetadata => vcMetadata.isPinned,
  );
  const vcMetadataOrderedByPinStatus = pinned.concat(unpinned);

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
  };

  const clearIndividualId = () => {
    GET_INDIVIDUAL_ID({id: '', idType: 'UIN'});
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
  const downloadFailedVcsErrorMessage = `${t(
    'errors.downloadLimitExpires.message',
  )}${failedVCsList}`;

  const isDownloadFailedVcs =
    useIsFocused() &&
    controller.downloadFailedVcs.length >= 1 &&
    !controller.AddVcModalService &&
    !controller.GetVcModalService;

  return (
    <React.Fragment>
      <Column fill style={{display: props.isVisible ? 'flex' : 'none'}}>
        {controller.isRequestSuccessful && (
          <BannerNotification
            message={t('downloadingYourCard')}
            onClosePress={() => {
              controller.RESET_STORE_VC_ITEM_STATUS();
              clearIndividualId();
            }}
            testId={'downloadingVcPopup'}
          />
        )}
        {controller.isBindingSuccess && (
          <BannerNotification
            message={t('activated')}
            onClosePress={controller.DISMISS_WALLET_BINDING_NOTIFICATION_BANNER}
            testId={'activatedVcPopup'}
          />
        )}
        <Column fill pY={11} pX={8}>
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
                {vcMetadataOrderedByPinStatus.map(vcMetadata => {
                  const iconProps = vcMetadata.isPinned ? pinIconProps : {};
                  return (
                    <VcItemContainer
                      {...iconProps}
                      key={vcMetadata.getVcKey()}
                      vcMetadata={vcMetadata}
                      margin="0 2 8 2"
                      onPress={controller.VIEW_VC}
                      isDownloading={controller.inProgressVcDownloads?.has(
                        vcMetadata.getVcKey(),
                      )}
                    />
                  );
                })}
              </Column>
            </React.Fragment>
          )}
          {controller.vcMetadatas.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                <Image source={Theme.DigitalIdentityLogo} />
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
        isVisible={controller.showHardwareKeystoreNotExistsAlert}
        title={t('errors.keystoreNotExists.title')}
        message={t('errors.keystoreNotExists.message')}
        onButtonPress={controller.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS}
        buttonText={t('errors.keystoreNotExists.riskOkayText')}
        customHeight={'auto'}>
        <Row>
          <Button
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
        customHeight={'auto'}
      />

      <MessageOverlay
        isVisible={isDownloadFailedVcs}
        title={t('errors.downloadLimitExpires.title')}
        message={downloadFailedVcsErrorMessage}
        onButtonPress={controller.DELETE_VC}
        buttonText={t('common:ok')}
        customHeight={'auto'}
      />

      {controller.isNetworkOff && (
        <Error
          testID={`networkOffError`}
          isVisible={controller.isNetworkOff}
          isModal={true}
          title={t('errors.noInternetConnection.title')}
          message={t('errors.noInternetConnection.message')}
          onDismiss={controller.DISMISS}
          tryAgain={controller.TRY_AGAIN}
          image={<Image source={Theme.NoInternetConnection} />}
        />
      )}
    </React.Fragment>
  );
};
