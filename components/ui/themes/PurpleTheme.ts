/* eslint-disable sonarjs/no-duplicate-string */
import {Dimensions, Platform, StyleSheet, ViewStyle} from 'react-native';
import {Spacing} from '../styleUtils';

const Colors = {
  Black: '#231F20',
  Zambezi: '#5F5F5F',
  Grey: '#B0B0B0',
  Grey5: '#E0E0E0',
  Grey6: '#F2F2F2',
  Gray40: '#666666',
  Gray30: '#444444',
  Gray44: '#707070',
  Gray50: '#999999',
  Gray9: '#171717',
  DimGray: '#737373',
  platinumGrey: '#EDEDED',
  Orange: '#F2811D',
  LightOrange: '#FDF1E6',
  LightGrey: '#FAF9FF',
  ShadeOfGrey: '#6F6F6F',
  mediumDarkGrey: '#7B7B7B',
  White: '#FFFFFF',
  Red: '#EB5757',
  Green: '#219653',
  Transparent: 'transparent',
  Warning: '#f0ad4e',
  GrayText: '#6F6F6F',
  mediumLightGrayText: '#A7A7A7',
  dorColor: '#CBCBCB',
  plainText: '#FFD6A7',
  walletbindingLabel: '#000000',
  GradientColors: ['#373086', '#70308C'],
  DisabledColors: ['#C7C7C7', '#C7C7C7'],
  captureIconBorder: '#F59B4B',
  Purple: '#70308C',
  LightPurple: '#AEA7FF',
  TimeoutHintBoxColor: '#FFF7E5',
  TimoutHintText: '#8B6105',
  resendCodeTimer: '#555555',
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const PurpleTheme = {
  Colors: {
    TabItemText: Colors.Purple,
    Details: Colors.Black,
    DetailsLabel: Colors.Gray40,
    LoadingDetailsLabel: Colors.Gray40,
    DetailsLabel: Colors.Gray40,
    AddIdBtnBg: Colors.Purple,
    AddIdBtnTxt: Colors.Purple,
    DownloadIdBtnTxt: Colors.White,
    Loading: Colors.Purple,
    Cursor: Colors.Purple,
    noUinText: Colors.Purple,
    IconBg: Colors.Purple,
    popUp: Colors.Green,
    Icon: Colors.Purple,
    GrayIcon: Colors.Gray50,
    helpText: Colors.Gray44,
    borderBottomColor: Colors.Grey6,
    whiteBackgroundColor: Colors.White,
    lightGreyBackgroundColor: Colors.LightGrey,
    errorGrayText: Colors.mediumDarkGrey,
    profileLanguageValue: Colors.Grey,
    aboutVersion: Colors.Gray40,
    profileAuthFactorUnlock: Colors.Grey,
    profileLabel: Colors.Black,
    profileValue: Colors.Grey,
    switchHead: Colors.Purple,
    switchTrackTrue: Colors.LightPurple,
    switchTrackFalse: Colors.Grey,
    overlayBackgroundColor: Colors.White,
    rotatingIcon: Colors.Grey5,
    loadingLabel: Colors.Grey6,
    textLabel: Colors.Grey,
    textValue: Colors.Black,
    requesterName: Colors.Red,
    errorMessage: Colors.Red,
    QRCodeBackgroundColor: Colors.LightGrey,
    ReceiveVcModalBackgroundColor: Colors.LightGrey,
    ToastItemText: Colors.White,
    VerifiedIcon: Colors.Green,
    whiteText: Colors.White,
    flipCameraIcon: Colors.Black,
    IdInputModalBorder: Colors.Grey,
    RetrieveIdLabel: Colors.ShadeOfGrey,
    inputSelection: Colors.Purple,
    checkCircleIcon: Colors.White,
    OnboardingCircleIcon: Colors.White,
    OnboardingCloseIcon: Colors.White,
    WarningIcon: Colors.Warning,
    DefaultToggle: Colors.LightPurple,
    ProfileIconBg: Colors.LightPurple,
    GrayText: Colors.GrayText,
    gradientBtn: Colors.GradientColors,
    dotColor: Colors.dorColor,
    plainText: Colors.plainText,
    IconBackground: Colors.LightPurple,
    GradientColors: Colors.GradientColors,
    DisabledColors: Colors.DisabledColors,
    getVidColor: Colors.Zambezi,
    TimeoutHintBoxColor: Colors.TimeoutHintBoxColor,
    TimoutHintText: Colors.TimoutHintText,
    walletbindingLabel: Colors.Black,
    walletbindingContent: Colors.Gray40,
    resendCodeTimer: Colors.resendCodeTimer,
    statusLabel: Colors.Black,
    statusMessage: Colors.Gray40,
  },
  Styles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: Colors.Transparent,
    },
    loadingTitle: {
      color: Colors.Transparent,
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: Colors.Transparent,
      fontSize: 12,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    detailsValue: {
      color: Colors.Black,
      fontSize: 12,
    },
    statusLabel: {
      color: Colors.Gray30,
      fontSize: 12,
    },
    activationTab: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginRight: 20,
      marginStart: 10,
    },
    kebabIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    verifiedIconContainer: {
      marginRight: 3,
    },
    verifiedIconInner: {
      backgroundColor: 'white',
      borderRadius: 10,
    },
    vcItemLabelHeader: {
      color: Colors.Gray40,
    },
    closeDetails: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: 90,
    },
    loadingContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    loadingCardDetailsContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    cardDetailsContainer: {},
    bottomTabIconStyle: {
      padding: 4,
      width: 36,
      height: 36,
      borderRadius: 6,
      backgroundColor: Colors.LightPurple,
    },
    downloadingVcPopUp: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.Green,
      height: 39,
      position: 'relative',
      paddingHorizontal: 12,
    },
    homeScreenContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.4,
      elevation: 5,
      padding: 10,
    },
    vertloadingContainer: {
      flex: 1,
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
      padding: 5,
    },
    closeDetailsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    closecardMosipLogo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      marginLeft: 300,
    },
    horizontalLine: {
      height: 1,
      backgroundColor: Colors.Grey,
    },
    verticalLine: {
      width: 1,
      height: 30,
      backgroundColor: Colors.Grey,
      marginVertical: 8,
      marginLeft: -45,
      marginRight: 22,
    },
    closeCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 7,
    },
    selectedBindedVc: {
      borderRadius: 15,
      margin: 5,
      borderWidth: 3,
      borderColor: Colors.Green,
      overflow: 'hidden',
    },
    selectedVc: {
      borderRadius: 10,
      margin: 5,
      borderWidth: 2,
      borderColor: Colors.Purple,
    },
    labelPartContainer: {
      marginLeft: 16,
      flex: 1,
    },
    urlContainer: {
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 12,
      fontSize: 12,
    },
    lockDomainContainer: {
      backgroundColor: Colors.White,
      alignSelf: 'center',
      borderRadius: 15,
      width: 100,
    },
    bottomButtonsContainer: {
      height: 'auto',
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      padding: 6,
      backgroundColor: Colors.White,
    },
    consentPageTop: {
      backgroundColor: Colors.White,
      height: 160,
      borderRadius: 6,
    },
    consentDottedLine: {
      width: 182,
      borderWidth: 2,
      margin: 5,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: 'grey',
    },
    labelPart: {
      marginTop: 10,
      alignItems: 'flex-start',
    },
    openCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
    backgroundImageContainer: {
      flex: 1,
      padding: 10,
      overflow: 'hidden',
    },
    successTag: {
      backgroundColor: Colors.Green,
      height: 43,
      flex: 1,
      alignItems: 'center',
      paddingLeft: 6,
    },
    closeDetailsHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 18,
      margin: 6,
    },
    openDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    logo: {
      height: 40,
      width: 40,
      marginRight: 4,
    },
    issuerLogo: {
      resizeMode: 'contain',
      aspectRatio: 1,
      height: 60,
    },
    vcDetailsLogo: {
      height: 35,
      width: 90,
    },
    homeCloseCardDetailsHeader: {
      flex: 1,
    },
    cardDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    mosipLogoContainer: {},
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openDetailsContainer: {
      flex: 1,
      padding: 10,
    },
    profileIconBg: {
      padding: 8,
      width: 40,
      height: 40,
      borderRadius: 6,
      backgroundColor: Colors.LightPurple,
    },
    IconContainer: {
      padding: 6,
      width: 36,
      marginRight: 4,
      marginLeft: 10,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightPurple,
    },
    cameraFlipIcon: {
      height: 42,
      width: 42,
    },
    imageCaptureButton: {
      marginLeft: 130,
      marginRight: 50,
    },
    settingsIconBg: {
      padding: 6,
      width: 36,
      marginRight: 4,
      height: 36,
      backgroundColor: Colors.Transparent,
    },
    backArrowContainer: {
      padding: 6,
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightPurple,
    },
    receiveCardsContainer: {
      height: Dimensions.get('window').height * 0.12,
      width: Dimensions.get('window').width * 0.45,
      alignItems: 'center',
      borderBottomRightRadius: 0,
      padding: 15,
      marginVertical: 18,
      elevation: 1,
    },
    domainVerifiyIcon: {
      padding: 20,
      marginLeft: 120,
      width: 130,
      height: 130,
      borderRadius: 60,
      borderWidth: 10,
      borderColor: Colors.White,
      backgroundColor: Colors.LightPurple,
    },
    pinIcon: {
      height: 39,
      width: 39,
      marginLeft: -13,
      marginTop: -9,
    },
    faceImage: {
      borderRadius: 10,
      height: 96,
      width: 88,
    },
    closeCardImage: {
      width: 80,
      height: 82,
      borderRadius: 100,
    },
    openCardImage: {
      width: 100,
      height: 106,
      borderRadius: 5,
      marginTop: 10,
    },
    versionContainer: {
      backgroundColor: Colors.Grey6,
      margin: 4,
      borderRadius: 14,
    },
    primaryRow: {
      backgroundColor: Colors.LightPurple,
      paddingHorizontal: 18,
      paddingVertical: 9,
      justifyContent: 'space-between',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    scannerContainer: {
      borderRadius: 24,
      alignSelf: 'center',
      height: 350,
      width: 320,
      overflow: 'hidden',
    },
    scanner: {
      height: 400,
      width: '100%',
      margin: 'auto',
    },
    cameraDisabledPopUp: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.Red,
      height: 75,
      position: 'relative',
      paddingHorizontal: 15,
      marginTop: -36,
    },
    photoConsentLabel: {
      backgroundColor: Colors.White,
      padding: 0,
      borderWidth: 0,
    },
    tabIndicator: {
      backgroundColor: Colors.Purple,
    },
    tabContainer: {
      backgroundColor: Colors.Transparent,
      justifyContent: 'center',
    },
    tabView: {
      flex: 1,
    },
    detailsText: {
      fontWeight: 'bold',
      fontSize: 15,
      fontFamily: 'Inter_700Bold',
    },
    getId: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 6,
    },
    placeholder: {
      fontFamily: 'Inter_600SemiBold',
    },
    hrLine: {
      borderBottomColor: Colors.Gray44,
      borderBottomWidth: 0.3,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    hrLineFill: {
      borderBottomColor: Colors.platinumGrey,
      borderBottomWidth: 1.3,
    },
    downloadFabIcon: {
      height: 70,
      width: 70,
      borderRadius: 200,
      padding: 10,
      backgroundColor: Colors.Purple,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      elevation: 5,
      position: 'absolute',
      bottom: Dimensions.get('window').width * 0.1,
      right: Dimensions.get('window').width * 0.1,
    },
    boxShadow: generateBoxShadowStyle(),
  }),
  QrCodeStyles: StyleSheet.create({
    magnifierZoom: {
      backgroundColor: Colors.White,
      width: 30,
      height: 30,
      alignItems: 'center',
      padding: 5,
      borderTopLeftRadius: 11,
    },
    expandedQrCode: {
      backgroundColor: Colors.White,
      width: 350,
      borderRadius: 21,
    },
    QrCodeHeader: {
      backgroundColor: Colors.White,
      borderTopLeftRadius: 21,
      borderTopRightRadius: 21,
      justifyContent: 'space-between',
      fontFamily: 'Inter_700Bold',
      paddingBottom: 10,
      paddingRight: 15,
      paddingLeft: 130,
      elevation: 2,
    },
    warningText: {
      color: Colors.Red,
      fontSize: 18,
    },
    QrView: {
      padding: 6,
      backgroundColor: 'white',
      marginTop: 20,
      borderRadius: 10,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
  }),
  PinInputStyle: StyleSheet.create({
    input: {
      borderBottomWidth: 3,
      borderColor: Colors.Grey,
      color: Colors.Black,
      flex: 1,
      fontSize: 33,
      fontFamily: 'Inter_600SemiBold',
      height: 40,
      lineHeight: 28,
      margin: 8,
      textAlign: 'center',
    },
    onEnteringPin: {
      borderBottomWidth: 3,
      borderColor: Colors.Purple,
      color: Colors.Black,
      flex: 1,
      fontFamily: 'Inter_700Bold',
      fontSize: 29,
      height: 60,
      margin: 8,
      textAlign: 'center',
    },
  }),
  TextStyles: StyleSheet.create({
    header: {
      color: Colors.Black,
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 19,
      paddingTop: 4,
    },
    subHeader: {
      color: Colors.mediumLightGrayText,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 19,
      fontSize: 13,
      paddingTop: 3,
    },
    semiBoldHeader: {
      color: Colors.Black,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 21,
      paddingTop: 4,
    },
    retrieveIdLabel: {
      color: Colors.ShadeOfGrey,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 18,
    },
    helpDetailes: {
      margin: 5,
      color: Colors.Gray44,
      fontFamily: 'Inter_600SemiBold',
    },
    aboutDetailes: {
      color: Colors.Black,
      fontSize: 18,
      margin: 7,
      lineHeight: 18,
    },
    error: {
      color: Colors.Red,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
    },
    base: {
      color: Colors.Black,
      fontSize: 16,
      lineHeight: 18,
    },
    regular: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
    },
    regularGrey: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      lineHeight: 19,
      color: Colors.ShadeOfGrey,
    },
    semibold: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
    },
    bold: {
      fontFamily: 'Inter_700Bold',
    },
    small: {
      fontSize: 13,
      lineHeight: 21,
    },
    extraSmall: {
      fontSize: 12,
    },
    smaller: {
      fontSize: 11,
      lineHeight: 18,
    },
    large: {
      fontSize: 18,
    },
  }),
  VcItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  ToastItemStyles: StyleSheet.create({
    toastContainer: {
      backgroundColor: Colors.Purple,
      position: 'absolute',
      alignSelf: 'center',
      top: 80,
      borderRadius: 4,
    },
    messageContainer: {
      fontSize: 12,
    },
  }),
  LoaderStyles: StyleSheet.create({
    titleContainer: {
      marginLeft: Dimensions.get('screen').width * 0.001,
      marginBottom: 17,
      marginTop: 22,
    },
  }),
  ButtonStyles: StyleSheet.create({
    fill: {
      flex: 1,
    },
    solid: {
      backgroundColor: Colors.Purple,
    },
    clear: {
      backgroundColor: Colors.Transparent,
    },
    outline: {
      backgroundColor: Colors.Transparent,
      borderColor: Colors.Purple,
    },
    container: {
      height: 45,
      flexDirection: 'row',
    },
    disabled: {
      backgroundColor: Colors.Grey,
    },
    addId: {
      backgroundColor: Colors.Purple,
    },
    gradient: {
      borderRadius: 9,
      width: Dimensions.get('window').width * 0.72,
      alignSelf: 'center',
      margin: 4,
    },
    float: {
      borderRadius: 9,
      alignSelf: 'center',
      fontSize: 10,
      elevation: 5,
      position: 'absolute',
      bottom: 24,
    },
    clearAddIdBtnBg: {
      backgroundColor: Colors.Transparent,
    },
    radius: {
      borderRadius: 10,
      backgroundColor: Colors.Purple,
    },
  }),
  OIDCAuthStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
  }),
  QRCodeOverlay: StyleSheet.create({
    header: {},
  }),
  SelectVcOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    consentCheckContainer: {
      backgroundColor: Colors.White,
      borderWidth: 0,
      marginTop: -15,
      fontFamily: 'Inter_600SemiBold',
      padding: 0,
    },
    timeoutHintContainer: {
      backgroundColor: Colors.TimeoutHintBoxColor,
      margin: 21,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
    },
    sharedSuccessfully: {
      flex: 1,
      backgroundColor: Colors.White,
    },
  }),
  AppMetaDataStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    contentView: {
      flex: 1,
      padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 'normal',
      color: 'rgb(28,28,30)',
    },
  }),
  FooterStyles: StyleSheet.create({
    bottom: {
      justifyContent: 'flex-end',
      backgroundColor: Colors.Grey6,
      borderRadius: 15,
      padding: 10,
    },
  }),
  ModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
    defaultModal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 18,
      marginVertical: 8,
    },
    progressingModal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 36,
      marginVertical: 8,
      marginHorizontal: 18,
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginHorizontal: 18,
      marginVertical: 6,
    },
  }),
  UpdateModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  TextEditOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  PasscodeStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  KebabPopUpStyles: StyleSheet.create({
    kebabPopUp: {
      flex: 1,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      width: Dimensions.get('screen').width,
      marginTop: Dimensions.get('screen').height * 0.55,
    },
    kebabHeaderStyle: {
      justifyContent: 'space-between',
      fontFamily: 'Inter_700Bold',
      paddingTop: 15,
    },
  }),
  MessageOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 5,
      borderRadius: 10,
    },
    buttonContainer: {
      justifyContent: 'center',
      marginBottom: 75,
    },
    popupOverLay: {
      backgroundColor: Colors.White,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    halfButton: {
      borderRadius: 8,
      margin: '0.5%',
    },
  }),
  BindingVcWarningOverlay: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
      borderRadius: 15,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  }),
  RevokeStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    revokeView: {padding: 20},
    flexRow: {flexDirection: 'row', margin: 0, padding: 0},
    rowStyle: {flexDirection: 'column', justifyContent: 'space-between'},
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  VerifyIdentityOverlayStyles: StyleSheet.create({
    content: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: Colors.White,
    },
  }),
  RevokeConfirmStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  OtpVerificationStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
    close: {
      position: 'absolute',
      top: 32,
      right: 0,
      color: Colors.Purple,
    },
  }),
  MessageStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
    squircleContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 16,
    },
  }),
  VidItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  OnboardingOverlayStyles: StyleSheet.create({
    overlay: {
      padding: 24,
      bottom: 86,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
    },
    slide: {
      width: '100%',
      padding: 20,
    },
    slider: {
      backgroundColor: Colors.Purple,
      minHeight: 300,
      width: '100%',
      margin: 0,
      borderRadius: 4,
    },
    appSlider: {},
    sliderTitle: {
      color: Colors.White,
      marginBottom: 20,
      fontFamily: 'Inter_700Bold',
    },
    text: {
      color: Colors.White,
    },
    paginationContainer: {
      margin: 10,
    },
    paginationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeIcon: {
      alignItems: 'flex-end',
      end: 16,
      top: 40,
      zIndex: 1,
    },
    bottomContainer: {
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -185,
      paddingBottom: 100,
    },
  }),
  claimsContainer: StyleSheet.create({
    container: {
      backgroundColor: Colors.Transparent,
    },
  }),
  issuersScreenStyles: StyleSheet.create({
    issuerListOuterContainer: {
      padding: 10,
      flex: 1,
      backgroundColor: Colors.White,
    },
    issuersContainer: {marginHorizontal: 3},
    issuerBoxContainer: {
      margin: 5,
      flex: 1,
      padding: 10,
      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      paddingHorizontal: 6,
      paddingVertical: 8,
      backgroundColor: Colors.White,
    },
    issuerBoxContainerPressed: {
      margin: 5,
      flex: 1,
      padding: 10,
      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      paddingHorizontal: 6,
      paddingVertical: 8,
      backgroundColor: Colors.Grey,
    },
    issuerHeading: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      lineHeight: 17,
    },
    issuerDescription: {
      fontSize: 11,
      lineHeight: 14,
      color: Colors.ShadeOfGrey,
    },
    issuerIcon: {
      resizeMode: 'contain',
      height: 33,
      width: 32,
      marginBottom: 9,
      marginTop: 8,
      marginLeft: 2.5,
    },
    loaderHeadingText: {
      flex: 1,
      flexDirection: 'column',
    },
  }),
  ErrorStyles: StyleSheet.create({
    image: {marginTop: -60, paddingBottom: 26},
    title: {
      color: Colors.Black,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 21,
      paddingTop: 4,
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 25,
      marginHorizontal: 40,
      color: Colors.mediumDarkGrey,
    },
  }),
  ICON_SMALL_SIZE: 16,
  ICON_MID_SIZE: 22,
  PinIcon: require('../../../assets/pin_icon.png'),
  CloseCard: require('../../../assets/card_bg.png'),
  CardBackground: require('../../../assets/card_bg.png'),
  OpenCard: require('../../../assets/card_bg.png'),
  activationPending: require('../../../assets/pending_activation.png'),
  ProfileIcon: require('../../../purpleAssets/profile_icon.png'),
  MosipSplashLogo: require('../../../assets/icon.png'),
  MosipLogo: require('../../../assets/mosip-logo.png'),
  CameraFlipIcon: require('../../../assets/camera-flip-icon.png'),
  ImageCaptureButton: require('../../../assets/capture-button.png'),
  DomainWarningLogo: require('../../../assets/domain-warning.png'),
  WarningLogo: require('../../../assets/warningLogo.png'),
  OtpLogo: require('../../../purpleAssets/otp-mobile-logo.png'),
  SuccessLogo: require('../../../assets/success-logo.png'),
  ReceiveCardIcon: require('../../../assets/receive-card-icon.png'),
  ReceivedCardsIcon: require('../../../assets/received-cards-icon.png'),
  DigitalIdentityLogo: require('../../../assets/digital-identity-icon.png'),
  InjiLogoWhite: require('../../../assets/inji-logo-white.png'),
  InjiProgressingLogo: require('../../../assets/progressing-logo.png'),
  LockIcon: require('../../../assets/lock-icon.png'),
  InjiHomeLogo: require('../../../assets/inji-home-logo.png'),
  MagnifierZoom: require('../../../assets/magnifier-zoom.png'),
  HelpIcon: require('../../../assets/help-icon.png'),
  sharingIntro: require('../../../assets/Secure-Sharing.png'),
  walletIntro: require('../../../assets/intro-wallet-binding.png'),
  IntroScanner: require('../../../assets/intro-scanner.png'),
  injiSmallLogo: require('../../../assets/inji_small_logo.png'),
  protectPrivacy: require('../../../assets/phone_mockup_1.png'),
  NoInternetConnection: require('../../../assets/no-internet-connection.png'),
  SomethingWentWrong: require('../../../assets/something-went-wrong.png'),
  DigitIcon: require('../../../assets/digit-icon.png'),

  elevation(level: ElevationLevel): ViewStyle {
    // https://ethercreative.github.io/react-native-shadow-generator/

    if (level === 0) {
      return null;
    }

    const index = level - 1;

    return {
      shadowColor: Colors.Black,
      shadowOffset: {
        width: 0,
        height: [1, 1, 1, 2, 2][index],
      },
      shadowOpacity: [0.18, 0.2, 0.22, 0.23, 0.25][index],
      shadowRadius: [1.0, 1.41, 2.22, 2.62, 3.84][index],
      elevation: level,
      zIndex: level,
      borderRadius: 4,
      backgroundColor: Colors.White,
    };
  },
  spacing(type: 'margin' | 'padding', values: Spacing) {
    if (Array.isArray(values) && values.length === 2) {
      return {
        [`${type}Horizontal`]: values[0],
        [`${type}Vertical`]: values[1],
      };
    }

    const [top, end, bottom, start] =
      typeof values === 'string' ? values.split(' ').map(Number) : values;

    return {
      [`${type}Top`]: top,
      [`${type}End`]: end != null ? end : top,
      [`${type}Bottom`]: bottom != null ? bottom : top,
      [`${type}Start`]: start != null ? start : end != null ? end : top,
    };
  },
};

function generateBoxShadowStyle() {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 1.2},
      shadowOpacity: 0.3,
      shadowRadius: 2.5,
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation: 4,
      shadowColor: '#000',
    };
  }
}
