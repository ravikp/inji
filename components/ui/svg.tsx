import React from 'react';
import Svg, {Image} from 'react-native-svg';
import {Theme} from './styleUtils';
import {ImageBackground} from 'react-native';
import Home from '../../assets/Home_tab_icon.svg';
import History from '../../assets/History_tab_icon.svg';
import Share from '../../assets/Scan_tab_icon.svg';
import PinICon from '../../assets/Pin_Icon.svg';
import WalletActivatedIcon from '../../assets/Wallet_Activated_Icon.svg';
import WalletUnActivatedIcon from '../../assets/Wallet_UnActivated_Icon.svg';
import InjiSmallLogo from '../../assets/Inji_Logo.svg';
import LockIcon from '../../assets/Lock_Icon1.svg';
import InjiLogo from '../../assets/Inji_Home_Logo1.svg';
import DigitalIdentity from '../../assets/Digital_Identity_Icon1.svg';
import ReceiveCard from '../../assets/Receive_Card.svg';
import ReceivedCards from '../../assets/Received_Cards.svg';
import ProgressIcon from '../../assets/Progress_Icon1.svg';
import testIDProps from '../../shared/commonUtil';
import Logo from '../../assets/Mosip_Logo1.svg';
import WarningLogo from '../../assets/Warning_Icon.svg';
import OtpVerificationIcon from '../../assets/Otp_Verification_Icon.svg';
import FlipCameraIcon from '../../assets/Flip_Camera_Icon.svg';
import CameraCaptureIcon from '../../assets/Camera_Capture_Icon.svg';
import SuccessLogo from '../../assets/Success_Message_Icon1.svg';
import ErrorLogo from '../../assets/Error_Message_Icon.svg';
import SuccessHomeIcon from '../../assets/Success_home_iocn.svg';
import SuccessHistoryIcon from '../../assets/Success_history_iocn.svg';
import NoInternetConnection from '../../assets/No_Internet_Connection.svg';
import SomethingWentWrong from '../../assets/Something_Went_Wrong.svg';
import MagnifierZoom from '../../assets/Magnifier_Zoom.svg';
import GoogleDriveIcon from '../../assets/Gdrive_Logo.svg';
import GoogleDriveIconSmall from '../../assets/google-drive-28.svg';
import ICloudLogo from '../../assets/Icloud-Logo.svg';
import KebabIcon from '../../assets/Detailed_view_kebab_icon.svg';
import {displayType} from '../../machines/issuersMachine';
import {IssuerProps} from '../openId4VCI/Issuer';
import Backup from '../../assets/Backup.svg';
import Restore from '../../assets/Restore.svg';
import PermissionDenied from '../../assets/Permission_Denied.svg';
import OutlinedShieldedIcon from '../../assets/Outlined_Shielded_Icon.svg';
import OutlinedPinIcon from '../../assets/Outlined_Pin_Icon.svg';
import OutlinedDeleteIcon from '../../assets/Outlined_Delete_Icon.svg';
import OutlinedScheduleIcon from '../../assets/Outlined_Schedule_Icon.svg';
import OutlinedShareWithSelfieIcon from '../../assets/Outlined_Share_With_Selfie_Icon.svg';
import OutlinedShareIcon from '../../assets/Outlined_Share_Icon.svg';
import {
  EsignetMosipVCItemContentProps,
  ExistingMosipVCItemContentProps,
} from '../VC/MosipVCItem/MosipVCItemContent';
import {VCMetadata} from '../../shared/VCMetadata';
import {VerifiableCredential} from '../../types/VC/ExistingMosipVC/vc';
import {ProfileIcon} from '../ProfileIcon';
import CloudUploadDoneIcon from '../../assets/Cloud_Upload_Done_Icon.svg';

export class SvgImage {
  static MosipLogo(props: LogoProps) {
    const {width, height} = props;
    return <Logo width={width} height={height} />;
  }

  static kebabIcon() {
    return <KebabIcon />;
  }

  static walletActivatedIcon() {
    return (
      <WalletActivatedIcon
        {...testIDProps('wallet-activated-icon')}
        style={{
          marginLeft: 10,
        }}
      />
    );
  }

  static walletUnActivatedIcon() {
    return (
      <WalletUnActivatedIcon
        {...testIDProps('wallet-unactivated-icon')}
        style={{
          marginLeft: 10,
        }}
      />
    );
  }

  static home(focused: boolean) {
    //NOTE: Here tab icons names should be same with key "name" in main.ts
    return (
      <Home
        color1={
          focused ? Theme.Colors.linearGradientStart : Theme.Colors.GrayIcon
        }
        color2={
          focused ? Theme.Colors.linearGradientEnd : Theme.Colors.GrayIcon
        }
      />
    );
  }

  static share(focused: boolean) {
    //NOTE: Here tab icons names should be same with key "name" in main.ts
    return (
      <Share
        color1={
          focused ? Theme.Colors.linearGradientStart : Theme.Colors.GrayIcon
        }
        color2={
          focused ? Theme.Colors.linearGradientEnd : Theme.Colors.GrayIcon
        }
      />
    );
  }

  static OutlinedShareIcon() {
    return (
      <OutlinedShareIcon
        {...testIDProps('outlined-share-icon')}
        style={{
          marginLeft: 5,
        }}
      />
    );
  }

  static OutlinedShareWithSelfieIcon() {
    return (
      <OutlinedShareWithSelfieIcon
        {...testIDProps('outlined-share-with-selfie-icon')}
        style={{
          marginLeft: 5,
        }}
      />
    );
  }

  static outlinedDeleteIcon() {
    return (
      <OutlinedDeleteIcon
        {...testIDProps('outlined-delete-icon')}
        style={{
          marginLeft: 5,
        }}
      />
    );
  }
  static OutlinedScheduleIcon() {
    return (
      <OutlinedScheduleIcon
        {...testIDProps('outlined-schedule-icon')}
        style={{
          marginLeft: 5,
        }}
      />
    );
  }

  static OutlinedShieldedIcon() {
    return (
      <OutlinedShieldedIcon
        {...testIDProps('outlined-shielded-icon')}
        style={{
          marginLeft: 5,
        }}
      />
    );
  }

  static OutlinedPinIcon() {
    return (
      <OutlinedPinIcon
        style={[Theme.Styles.pinIcon]}
        {...testIDProps('outlinedPinIcon')}
      />
    );
  }

  static history(focused: boolean) {
    //NOTE: Here tab icons names should be same with key "name" in main.ts
    return (
      <History
        color1={
          focused ? Theme.Colors.linearGradientStart : Theme.Colors.GrayIcon
        }
        color2={
          focused ? Theme.Colors.linearGradientEnd : Theme.Colors.GrayIcon
        }
      />
    );
  }

  static pinIcon(customStyle?: object) {
    return (
      <PinICon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        style={[Theme.Styles.pinIcon, customStyle]}
        {...testIDProps('pinIcon')}
      />
    );
  }

  static InjiSmallLogo() {
    return <InjiSmallLogo {...testIDProps('injiSmallLogo')} />;
  }

  static ProgressIcon() {
    return (
      <ProgressIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        color3={Theme.Colors.LinearGradientStroke}
        {...testIDProps('progressingLogo')}
      />
    );
  }

  static LockIcon() {
    return (
      <LockIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        style={{alignSelf: 'center'}}
      />
    );
  }

  static InjiLogo() {
    return (
      <InjiLogo
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static DigitalIdentity() {
    return (
      <DigitalIdentity
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static ReceiveCard() {
    return (
      <ReceiveCard
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static ReceivedCards() {
    return (
      <ReceivedCards
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static IssuerIcon(issuer: IssuerProps) {
    return (
      <Svg
        width="40"
        height="40"
        {...testIDProps(`issuerIcon-${issuer.testID}`)}>
        <Image
          href={getIssuerLogo(issuer.displayDetails)}
          x="0"
          y="0"
          height="40"
          width="40"
        />
      </Svg>
    );
  }

  static WarningLogo() {
    return <WarningLogo />;
  }

  static OtpVerificationIcon() {
    return (
      <OtpVerificationIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static VcItemContainerProfileImage(
    props: ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps,
    verifiableCredential: VerifiableCredential,
  ) {
    const imageUri = faceImageSource(props, verifiableCredential);
    return imageUri ? (
      <ImageBackground
        imageStyle={Theme.Styles.faceImage}
        source={{uri: imageUri}}
        style={Theme.Styles.closeCardImage}>
        {props?.isPinned && SvgImage.pinIcon()}
      </ImageBackground>
    ) : (
      <>
        <ProfileIcon
          isPinned={props?.isPinned}
          profileIconContainerStyles={Theme.Styles.ProfileIconContainer}
          profileIconSize={30}
        />
      </>
    );
  }

  static FlipCameraIcon() {
    const {width, height} = Theme.Styles.cameraFlipIcon;
    return (
      <FlipCameraIcon
        {...testIDProps('flipCameraIcon')}
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        width={width}
        height={height}
      />
    );
  }

  static CameraCaptureIcon() {
    return (
      <CameraCaptureIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static DataBackupIcon(width, height) {
    return (
      <Backup
        {...testIDProps('dataBackupIcon')}
        color1={Theme.Colors.Icon}
        width={width}
        height={height}
      />
    );
  }

  static RestoreIcon() {
    return (
      <Restore color1={Theme.Colors.Icon} {...testIDProps('restoreIcon')} />
    );
  }

  static SuccessLogo() {
    return <SuccessLogo {...testIDProps('SuccessLogo')} />;
  }

  static SuccessHomeIcon() {
    return (
      <SuccessHomeIcon
        {...testIDProps('SuccessHomeIcon')}
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static SuccessHistoryIcon() {
    return (
      <SuccessHistoryIcon
        {...testIDProps('SuccessHistoryIcon')}
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static ErrorLogo() {
    return <ErrorLogo {...testIDProps('ErrorLogo')} />;
  }

  static PermissionDenied() {
    return <PermissionDenied {...testIDProps('permissionDeniedImage')} />;
  }

  static CloudUploadDoneIcon() {
    return <CloudUploadDoneIcon {...testIDProps('cloudUploadDoneIcon')} />;
  }

  static NoInternetConnection() {
    return (
      <NoInternetConnection {...testIDProps('noInternetConnectionImage')} />
    );
  }

  static SomethingWentWrong() {
    return <SomethingWentWrong {...testIDProps('somethingWentWrongImage')} />;
  }

  static MagnifierZoom() {
    return <MagnifierZoom />;
  }

  static GoogleDriveIcon(width, height) {
    return (
      <GoogleDriveIcon
        width={width}
        height={height}
        {...testIDProps('googleDriveIcon')}
      />
    );
  }

  static GoogleDriveIconSmall(width, height) {
    return (
      <GoogleDriveIconSmall
        width={width}
        height={height}
        {...testIDProps('googleDriveIconSmall')}
      />
    );
  }
  static ICloudIcon(width, height) {
    return (
      <ICloudLogo
        width={width}
        height={height}
        {...testIDProps('iCloudIcon')}
      />
    );
  }
}

function getIssuerLogo(props: displayType) {
  return {uri: props.logo.url};
}

function faceImageSource(
  props: faceImageSourceProps,
  verifiableCredential: VerifiableCredential,
) {
  return props?.vcMetadata?.isFromOpenId4VCI()
    ? verifiableCredential?.credentialSubject?.face
    : props?.context?.credential?.biometrics?.face;
}

interface LogoProps {
  width: number;
  height: number;
}

interface faceImageSourceProps {
  vcMetadata: VCMetadata;
  verifiableCredential: VerifiableCredential;
  context: any;
}
