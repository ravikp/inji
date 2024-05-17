import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Camera} from 'expo-camera';
import {BarCodeEvent, BarCodeScanner} from 'expo-barcode-scanner';
import {
  Linking,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
} from 'react-native';
import {Theme} from './ui/styleUtils';
import {Column, Button, Text, Centered, Row} from './ui';
import {GlobalContext} from '../shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {selectIsActive} from '../machines/app';
import {useTranslation} from 'react-i18next';
import {useScanLayout} from '../screens/Scan/ScanLayoutController';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';

export const QrScanner: React.FC<QrScannerProps> = props => {
  const {t} = useTranslation('QrScanner');
  const {appService} = useContext(GlobalContext);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const controller = useScanLayout();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [
    showCameraPermissionDeniedBanner,
    setShowCameraPermissionDeniedBanner,
  ] = useState(false);

  const isActive = useSelector(appService, selectIsActive);

  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('App-Prefs:Privacy');
    }
  };

  useEffect(() => {
    if (isActive && !Boolean(hasCameraPermission)) {
      (async () => {
        setShowCameraPermissionDeniedBanner(false);
        const cameraPermissionResult = await Camera.getCameraPermissionsAsync();
        if (cameraPermissionResult.status === 'undetermined') {
          const response = await Camera.requestCameraPermissionsAsync();
          setHasCameraPermission(response.granted);
          if (response.granted === false) {
            setShowCameraPermissionDeniedBanner(true);
          }
        } else if (cameraPermissionResult.status === 'granted') {
          setHasCameraPermission(true);
        } else if (cameraPermissionResult.status === 'denied') {
          setHasCameraPermission(false);
          setShowCameraPermissionDeniedBanner(true);
        }
      })();
    }
  }, [isActive]);

  if (hasCameraPermission === null) {
    return <View />;
  }

  const CameraDisabledPopUp: React.FC = () => {
    return (
      <View
        {...testIDProps('cameraDisabledPopup')}
        style={Theme.CameraDisabledStyles.container}>
        <Column style={Theme.CameraDisabledStyles.banner}>
          <Row style={Theme.CameraDisabledStyles.bannerTextContainer}>
            <Column>
              <Text
                testID="cameraAccessDisabled"
                color={Theme.Colors.whiteText}
                margin="0 0 5 0"
                style={Theme.CameraDisabledStyles.bannerTitle}>
                {t('cameraAccessDisabled')}
              </Text>
              <Text
                testID="cameraPermissionGuide"
                color={Theme.Colors.whiteText}
                style={Theme.CameraDisabledStyles.bannerGuide}>
                {t('cameraPermissionGuideLabel')}
              </Text>
            </Column>
            <Pressable>
              <Icon
                testID="close"
                name="close"
                onPress={() => setShowCameraPermissionDeniedBanner(false)}
                color={Theme.Colors.whiteText}
                size={18}
              />
            </Pressable>
          </Row>
          <Row
            style={Theme.CameraDisabledStyles.bannerEnablePermissionContainer}>
            <Pressable onPress={openSettings}>
              <Text
                testID="EnablePermissionText"
                color={Theme.Colors.whiteText}
                size="regular"
                style={Theme.CameraDisabledStyles.bannerEnablePermission}>
                {t('EnablePermission')}
              </Text>
            </Pressable>
          </Row>
        </Column>
      </View>
    );
  };
  return (
    <>
      {hasCameraPermission ? (
        <Column fill align="space-between">
          <View style={Theme.CameraEnabledStyles.scannerContainer}>
            <Camera
              {...testIDProps('camera')}
              style={Theme.CameraEnabledStyles.scanner}
              barCodeScannerSettings={{
                barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
              onBarCodeScanned={scanned ? undefined : onBarcodeScanned}
              type={cameraType}
            />
          </View>
          {props.title && (
            <Text
              testID="holdPhoneSteadyMessage"
              align="center"
              style={Theme.CameraEnabledStyles.holdPhoneSteadyText}
              margin="0 57">
              {props.title}
            </Text>
          )}
          <Column crossAlign="center">
            <TouchableOpacity
              onPress={() => {
                setCameraType(
                  cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                );
              }}>
              {SvgImage.FlipCameraIcon()}
            </TouchableOpacity>
            <Text
              testID="flipCameraText"
              style={Theme.CameraEnabledStyles.iconText}>
              {t('flipCamera')}
            </Text>
          </Column>
        </Column>
      ) : (
        <View style={Theme.CameraDisabledStyles.scannerContainer} />
      )}
      {showCameraPermissionDeniedBanner && <CameraDisabledPopUp />}
    </>
  );

  function onBarcodeScanned(event: BarCodeEvent) {
    props.onQrFound(event.data);
    setScanned(true);
  }
};

interface QrScannerProps {
  onQrFound: (data: string) => void;
  title?: string;
}
