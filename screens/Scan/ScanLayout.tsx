import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SendVcScreen} from './SendVcScreen';
import {useScanLayout} from './ScanLayoutController';
import {ScanScreen} from './ScanScreen';
import {SCAN_ROUTES} from '../../routes/routesConstants';
import {SharingStatusModal} from './SharingStatusModal';
import {Theme} from '../../components/ui/styleUtils';
import {Icon} from 'react-native-elements';
import {Loader} from '../../components/ui/Loader';
import {SvgImage} from '../../components/ui/svg';
import {BANNER_TYPE_SUCCESS} from '../../shared/constants';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanLayout();

  if (
    controller.statusOverlay != null &&
    !controller.isAccepted &&
    !controller.isInvalid
  ) {
    return (
      <Loader
        title={controller.statusOverlay?.title}
        hint={controller.statusOverlay?.hint}
        onCancel={controller.statusOverlay?.onButtonPress}
        onStayInProgress={controller.statusOverlay?.onStayInProgress}
        isHintVisible={
          controller.isStayInProgress ||
          controller.isBleError ||
          controller.isSendingVc
        }
        onRetry={controller.statusOverlay?.onRetry}
        showBanner={controller.isFaceIdentityVerified}
        bannerMessage={t('ScanScreen:postFaceCapture:captureSuccessMessage')}
        onBannerClose={controller.CLOSE_BANNER}
        bannerType={BANNER_TYPE_SUCCESS}
        bannerTestID={'faceVerificationSuccess'}
      />
    );
  }

  return (
    <React.Fragment>
      <ScanStack.Navigator initialRouteName="ScanScreen">
        {!controller.isDone && (
          <ScanStack.Screen
            name={SCAN_ROUTES.SendVcScreen}
            component={SendVcScreen}
            options={{
              title: t('sharingVc'),
              headerBackVisible: false,
              headerRight: () => (
                <Icon
                  name="close"
                  color={Theme.Colors.blackIcon}
                  onPress={controller.CANCEL}
                />
              ),
            }}
          />
        )}
        <ScanStack.Screen
          name={SCAN_ROUTES.ScanScreen}
          component={ScanScreen}
          options={{
            headerTitleStyle: {fontSize: 30, fontFamily: 'Inter_600SemiBold'},
            title: t('MainLayout:share'),
          }}
        />
      </ScanStack.Navigator>

      <SharingStatusModal
        isVisible={controller.isAccepted}
        testId={'sharingSuccessModal'}
        buttonStatus={'homeAndHistoryIcons'}
        title={t('status.accepted.title')}
        message={t('status.accepted.message')}
        image={SvgImage.SuccessLogo()}
        goToHome={controller.GOTO_HOME}
        goToHistory={controller.GOTO_HISTORY}
      />

      {controller.errorStatusOverlay && (
        <SharingStatusModal
          isVisible={controller.errorStatusOverlay !== null}
          testId={'walletSideSharingErrorModal'}
          image={SvgImage.ErrorLogo()}
          title={controller.errorStatusOverlay.title}
          message={controller.errorStatusOverlay.message}
          gradientButtonTitle={t('status.bleError.retry')}
          clearButtonTitle={t('status.bleError.home')}
          onGradientButton={controller.onRetry}
          onClearButton={controller.GOTO_HOME}
        />
      )}
    </React.Fragment>
  );
};
