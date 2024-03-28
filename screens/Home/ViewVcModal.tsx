import React, {useEffect} from 'react';
import {Column, Row} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {MessageOverlay} from '../../components/MessageOverlay';
import {ToastItem} from '../../components/ui/ToastItem';
import {useViewVcModal, ViewVcModalProps} from './ViewVcModalController';
import {useTranslation} from 'react-i18next';
import {OtpVerificationModal} from './MyVcs/OtpVerificationModal';
import {BindingVcWarningOverlay} from './MyVcs/BindingVcWarningOverlay';
import {VcDetailsContainer} from '../../components/VC/VcDetailsContainer';
import {
  getEndEventData,
  getErrorEventData,
  sendEndEvent,
  sendErrorEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {Icon} from 'react-native-elements';
import {Theme} from '../../components/ui/styleUtils';
import testIDProps from '../../shared/commonUtil';
import {HelpScreen} from '../../components/HelpScreen';
import {Pressable} from 'react-native';
import {KebabPopUp} from '../../components/KebabPopUp';
import {SvgImage} from '../../components/ui/svg';
import {faceImageSource} from '../../components/VcItemContainerProfileImage';
import {VCMetadata} from '../../shared/VCMetadata';
import {WalletBinding} from './MyVcs/WalletBinding';
import {RemoveVcWarningOverlay} from './MyVcs/RemoveVcWarningOverlay';
import {HistoryTab} from './MyVcs/HistoryTab';
import {BannerNotification} from '../../components/BannerNotification';

export const ViewVcModal: React.FC<ViewVcModalProps> = props => {
  const {t} = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);

  useEffect(() => {
    let error = controller.walletBindingError;
    if (error) {
      error = controller.bindingAuthFailedError
        ? controller.bindingAuthFailedError + '-' + error
        : error;
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.ErrorId.activationFailed,
          error,
        ),
      );
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    }
  }, [controller.walletBindingError]);

  useEffect(() => {
    if (!controller.vc.vcMetadata.isVerified) {
      if (controller.verificationBannerStatus !== '') {
        controller.DISMISS_VERIFICATION_STATUS_BANNER();
      }
      props.vcItemActor.send({type: 'VERIFY'});
    }
  }, [controller.vc.vcMetadata.isVerified]);

  let selectedVcContext = props.vcItemActor.getSnapshot()?.context;

  const credential = new VCMetadata(
    selectedVcContext?.vcMetadata,
  ).isFromOpenId4VCI()
    ? selectedVcContext?.verifiableCredential?.credential
    : selectedVcContext?.verifiableCredential;

  const getVcProfileImage = faceImageSource({
    vcMetadata: new VCMetadata(selectedVcContext?.vcMetadata),
    context: props.vcItemActor.getSnapshot()?.context,
    credential: credential,
  });

  const headerRight = flow => {
    return flow === 'downloadedVc' ? (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <Icon
              {...testIDProps('help')}
              accessible={true}
              name="question"
              type="font-awesome"
              size={21}
              style={Theme.Styles.IconContainer}
              color={Theme.Colors.Icon}
            />
          }
        />
        <Pressable
          onPress={() => props.vcItemActor.send('KEBAB_POPUP')}
          accessible={false}>
          <KebabPopUp
            icon={SvgImage.kebabIcon()}
            vcMetadata={VCMetadata.fromVC(controller.vc.vcMetadata)}
            iconName="dots-three-horizontal"
            iconType="entypo"
            isVisible={
              props.vcItemActor.getSnapshot()?.context
                .isMachineInKebabPopupState
            }
            onDismiss={() => props.vcItemActor.send('DISMISS')}
            service={props.vcItemActor}
            vcHasImage={getVcProfileImage !== undefined}
          />
        </Pressable>
      </Row>
    ) : undefined;
  };
  return (
    <Modal
      isVisible={props.isVisible}
      testID="idDetailsHeader"
      arrowLeft={true}
      headerRight={headerRight(props.flow)}
      headerTitle={t('title')}
      onDismiss={props.onDismiss}
      headerElevation={2}>
      <BannerNotificationContainer />
      {controller.verificationBannerStatus != '' && (
        <BannerNotification
          type={controller.verificationBannerStatus}
          message={t(`bannerInfo.${controller.verificationBannerStatus}`)}
          onClosePress={() => controller.DISMISS_VERIFICATION_STATUS_BANNER()}
          key={'reVerificationInProgress'}
          testId={'reVerificationInProgress'}
        />
      )}

      <VcDetailsContainer
        vc={controller.vc}
        onBinding={controller.addtoWallet}
        isBindingPending={controller.isWalletBindingPending}
        activeTab={props.activeTab}
        vcHasImage={getVcProfileImage !== undefined}
      />

      {controller.isAcceptingRevokeInput && (
        <OIDcAuthenticationModal
          isVisible={controller.isAcceptingRevokeInput}
          onDismiss={controller.DISMISS}
          onVerify={() => {
            controller.revokeVc('111111');
          }}
          error={controller.otpError}
        />
      )}

      {controller.isAcceptingOtpInput && (
        <OtpVerificationModal
          service={props.vcItemActor}
          isVisible={controller.isAcceptingOtpInput}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          flow={TelemetryConstants.FlowType.vcLockOrRevoke}
        />
      )}

      {controller.isAcceptingBindingOtp && (
        <OtpVerificationModal
          service={props.vcItemActor}
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          phone={controller.isPhoneNumber}
          email={controller.isEmail}
          flow={TelemetryConstants.FlowType.vcActivation}
        />
      )}

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <MessageOverlay
        testID="walletBindingError"
        isVisible={controller.isBindingError}
        title={controller.walletBindingError}
        onButtonPress={() => {
          controller.CANCEL();
        }}
      />

      <MessageOverlay
        isVisible={controller.isWalletBindingInProgress}
        title={t('inProgress')}
        progress
      />

      {controller.toastVisible && <ToastItem message={controller.message} />}

      <WalletBinding
        service={props.vcItemActor}
        vcMetadata={controller.vc.vcMetadata}
      />

      <RemoveVcWarningOverlay
        testID="removeVcWarningOverlay"
        service={props.vcItemActor}
        vcMetadata={controller.vc.vcMetadata}
      />

      <HistoryTab
        service={props.vcItemActor}
        vcMetadata={VCMetadata.fromVC(controller.vc.vcMetadata)}
      />
    </Modal>
  );
};
