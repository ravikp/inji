import React, { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Switch } from 'react-native-elements';
import { I18nManager, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Centered, Button, Row, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useRequestScreen } from './RequestScreenController';
import { isGoogleNearbyEnabled } from '../../lib/smartshare';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export const RequestScreen: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();
  const props: RequestScreenProps = { t, controller };
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  useEffect(() => {
    (async () => {
      await BluetoothStateManager.onStateChange((state) => {
        if (state === 'PoweredOff') {
          setIsBluetoothOn(false);
        } else {
          setIsBluetoothOn(true);
        }
      }, true);
    })();
  }, [isBluetoothOn]);

  return (
    <Column
      fill
      padding="24"
      align="space-between"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      {loadQRCode()}
    </Column>
  );

  function loadQRCode() {
    if (controller.isNearByDevicesPermissionDenied) {
      return <NearByPrompt {...props} />;
    }
    if (
      (controller.isBluetoothDenied || !isBluetoothOn) &&
      controller.isReadyForBluetoothStateCheck
    ) {
      return <BluetoothPrompt {...props} />;
    }
    if (
      !controller.isCheckingBluetoothService &&
      !controller.isBluetoothDenied
    ) {
      return (
        <Column align="flex-end" fill>
          {controller.isWaitingForConnection && <SharingQR {...props} />}
          <StatusMessage {...props} />
        </Column>
      );
    }
  }
};

const BluetoothPrompt: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <Centered fill>
      <Text color={Theme.Colors.errorMessage} align="center" margin="0 10">
        {t(
          Platform.OS === 'ios' ? 'bluetoothStateIos' : 'bluetoothStateAndroid'
        )}
      </Text>
    </Centered>
  );
};

const NearByPrompt: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <Column fill align="space-between">
      <Centered fill>
        <Text color={Theme.Colors.errorMessage} align="center">
          {t('errors.nearbyDevicesPermissionDenied.message', {
            vcLabel: controller.vcLabel.singular,
          })}
        </Text>
      </Centered>
      <Button
        title={t('errors.nearbyDevicesPermissionDenied.button')}
        onPress={controller.GOTO_SETTINGS}
      />
    </Column>
  );
};

const SharingQR: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <React.Fragment>
      <Text align="center">
        {t('showQrCode', { vcLabel: controller.vcLabel.singular })}
      </Text>

      <Centered fill>
        {controller.connectionParams !== '' ? (
          <QRCode
            size={200}
            value={controller.connectionParams}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
          />
        ) : null}
      </Centered>
      {isGoogleNearbyEnabled && (
        <Row align="center" crossAlign="center" margin={[0, 0, 48, 0]}>
          <Text margin={[0, 16, 0, 0]}>{t('offline')}</Text>
          <Switch
            value={controller.sharingProtocol === 'ONLINE'}
            onValueChange={controller.SWITCH_PROTOCOL}
            disabled={Platform.OS === 'ios'}
          />
          <Text margin={[0, 0, 0, 16]}>{t('online')}</Text>
        </Row>
      )}
    </React.Fragment>
  );
};

const StatusMessage: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    controller.statusMessage !== '' && (
      <Column elevation={1} padding="16 24">
        <Text>{controller.statusMessage}</Text>
        {controller.statusHint !== '' && (
          <Text size="small" color={Theme.Colors.textLabel}>
            {controller.statusHint}
          </Text>
        )}
        {controller.isStatusCancellable && (
          <Button
            margin={[8, 0, 0, 0]}
            title={t('cancel', { ns: 'common' })}
            loading={controller.isCancelling}
            onPress={controller.CANCEL}
          />
        )}
      </Column>
    )
  );
};

interface RequestScreenProps {
  t: TFunction;
  controller: ReturnType<typeof useRequestScreen>;
}
