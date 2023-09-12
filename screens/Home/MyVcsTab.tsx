import React from 'react';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { RefreshControl, Image, View } from 'react-native';
import { useMyVcsTab } from './MyVcsTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { AddVcModal } from './MyVcs/AddVcModal';
import { GetVcModal } from './MyVcs/GetVcModal';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { GET_INDIVIDUAL_ID } from '../../shared/constants';
import {
  ErrorMessageOverlay,
  MessageOverlay,
} from '../../components/MessageOverlay';
import { Icon } from 'react-native-elements';
import {
  isOpenId4VCIEnabled,
  isVCFromOpenId4VCI,
} from '../../shared/openId4VCI/Utils';
import { VCItem } from '../../components/openId4VCI/VCItem';

export const MyVcsTab: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);
  const storeErrorTranslationPath = 'errors.savingFailed';

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
  };

  const clearIndividualId = () => {
    GET_INDIVIDUAL_ID('');
  };

  {
    controller.isRequestSuccessful
      ? setTimeout(() => {
          controller.DISMISS();
        }, 6000)
      : null;
  }

  const DownloadingVcPopUp: React.FC = () => {
    return (
      <View testID="downloadingVcPopup">
        <Row style={Theme.Styles.downloadingVcPopUp}>
          <Text color={Theme.Colors.whiteText} weight="semibold" size="smaller">
            {t('downloadingYourCard')}
          </Text>
          <Icon
            testID="close"
            name="close"
            onPress={() => {
              controller.DISMISS();
              clearIndividualId();
            }}
            color={Theme.Colors.whiteText}
            size={19}
          />
        </Row>
      </View>
    );
  };

  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        {controller.isRequestSuccessful && <DownloadingVcPopUp />}
        <Column fill pY={18} pX={15}>
          {controller.vcKeys.length > 0 && (
            <React.Fragment>
              <Column
                scroll
                margin="0 0 20 0"
                backgroundColor={Theme.Colors.lightGreyBackgroundColor}
                refreshControl={
                  <RefreshControl
                    refreshing={controller.isRefreshingVcs}
                    onRefresh={controller.REFRESH}
                  />
                }>
                {controller.vcKeys.map((vcKey, index) => {
                  if (vcKey.split(':')[4] === 'true') {
                    return (
                      <VcItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                        iconName="pushpin"
                        iconType="antdesign"
                      />
                    );
                  } else if (isOpenId4VCIEnabled && isVCFromOpenId4VCI(vcKey)) {
                    return (
                      <VCItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                      />
                    );
                  }
                })}
                {controller.vcKeys.map((vcKey, index) => {
                  if (vcKey.split(':')[4] === 'false') {
                    return (
                      <VcItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                      />
                    );
                  }
                  //todo once pinning feature is finalised need to remove the negation before isOpenId4VCIEnabled.
                  else if (!isOpenId4VCIEnabled && isVCFromOpenId4VCI(vcKey)) {
                    return (
                      <VCItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                      />
                    );
                  }
                })}
              </Column>
              {!isOpenId4VCIEnabled() && (
                <Button
                  testID="downloadCard"
                  type="gradient"
                  disabled={controller.isRefreshingVcs}
                  title={t('downloadCard')}
                  onPress={controller.DOWNLOAD_ID}
                />
              )}
            </React.Fragment>
          )}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                <Image source={Theme.DigitalIdentityLogo} />
                <Text
                  align="center"
                  weight="bold"
                  margin="33 0 6 0"
                  lineHeight={1}>
                  {t('bringYourDigitalID')}
                </Text>
                <Text
                  style={Theme.TextStyles.bold}
                  color={Theme.Colors.textLabel}
                  align="center"
                  margin="0 12 30 12">
                  {t('generateVcDescription')}
                </Text>
                {!isOpenId4VCIEnabled() && (
                  <Button
                    type="gradient"
                    disabled={controller.isRefreshingVcs}
                    title={t('downloadCard')}
                    onPress={controller.DOWNLOAD_ID}
                  />
                )}
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
        onBackdropPress={controller.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS}>
        <Row>
          <Button
            type="clear"
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
        onCancel={controller.DISMISS}
      />
      <ErrorMessageOverlay
        translationPath={'MyVcsTab'}
        isVisible={controller.isMinimumStorageLimitReached}
        error={'errors.storageLimitReached'}
        onDismiss={controller.DISMISS}
      />
      <ErrorMessageOverlay
        translationPath={'MyVcsTab'}
        isVisible={controller.isTampered}
        error={'errors.vcIsTampered'}
        onDismiss={controller.IS_TAMPERED}
      />
    </React.Fragment>
  );
};
