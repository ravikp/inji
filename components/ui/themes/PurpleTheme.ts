/* eslint-disable sonarjs/no-duplicate-string */
import {
  Dimensions,
  I18nManager,
  StatusBar,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Spacing} from '../styleUtils';
import {COPILOT_HEIGHT, isIOS} from '../../../shared/constants';
import Constants from 'expo-constants';
import HomeScreenLogo from '../../../assets/Inji_Home_Logo.svg';
import InjiLogoSmall from '../../../assets/InjiLogo.svg';
import i18next from '../../../i18n';

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
  Gray89: '#E3E3E3',
  Gray97: '#F7F7F7',
  DimGray: '#737373',
  DarkGray: '#A5A5A5',
  platinumGrey: '#EDEDED',
  Orange: '#F2811D',
  OrangeShade: '#E3781A',
  OrangeBrown: '#D9822B',
  Blue: '#0000FF',
  LightOrange: '#FDF1E6',
  LightGrey: '#F8F8F8',
  ShadeOfGrey: '#6F6F6F',
  mediumDarkGrey: '#7B7B7B',
  White: '#FFFFFF',
  Red: '#EB5757',
  LightRed: '#DB2E2E',
  Green: '#219653',
  Transparent: 'transparent',
  Warning: '#f0ad4e',
  GrayText: '#6F6F6F',
  mediumLightGrayText: '#A7A7A7',
  dorColor: '#CBCBCB',
  plainText: '#F3E2FF',
  walletbindingLabel: '#000000',
  GradientColors: ['#373086', '#70308C'],
  GradientColorsLight: ['#F3E2FF', '#F3E2FF'],
  DisabledColors: ['#C7C7C7', '#C7C7C7'],
  captureIconBorder: '#F59B4B',
  Purple: '#70308C',
  LightPurple: '#F3E2FF',
  TimeoutHintBoxColor: '#FBF5FF',
  TimeoutHintBoxBorder: '#F3E2FF',
  TimeoutHintText: '#1C1C1C',
  resendCodeTimer: '#555555',
  uncheckedIcon: '#DBDBDB',
  startColor: '#8449A5',
  endColor: '#683386',
  stroke: '#8449A5',
  iconBg: '#fbf5ff',
  warningLogoBg: '#F3E2FF',
  tooltip: '#B7B7B7',
  toolTipContent: '#4B4B4B',
  toolTipPointer: '#E0E0E0',
  Mercury: '#E6E6E6',
  Yellow: '#E8A94F',
  selectIDTextGradient: ['#F5F5F5', '#FFFFFF'],
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const PurpleTheme = {
  Colors: {
    ProfileIconColor: Colors.DarkGray,
    DetailedViewBackground: Colors.Gray97,
    TabItemText: Colors.Purple,
    Details: Colors.Black,
    DetailsLabel: Colors.Gray40,
    LoadingDetailsLabel: Colors.Gray40,
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
    aboutVersion: Colors.Gray40,
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
    RetrieveIdLabel: Colors.ShadeOfGrey,
    inputSelection: Colors.Purple,
    checkCircleIcon: Colors.White,
    OnboardingCircleIcon: Colors.White,
    OnboardingCloseIcon: Colors.White,
    WarningIcon: Colors.Warning,
    DefaultToggle: Colors.LightPurple,
    GrayText: Colors.GrayText,
    gradientBtn: Colors.GradientColors,
    selectIDTextGradient: ['#F5F5F5', '#FFFFFF'],
    dotColor: Colors.dorColor,
    plainText: Colors.plainText,
    IconBackground: Colors.LightPurple,
    GradientColors: Colors.GradientColors,
    GradientColorsLight: Colors.GradientColorsLight,
    DisabledColors: Colors.DisabledColors,
    getVidColor: Colors.Zambezi,
    TimeoutHintBoxColor: Colors.TimeoutHintBoxColor,
    TimeoutHintText: Colors.TimeoutHintText,
    walletbindingLabel: Colors.Black,
    walletbindingContent: Colors.Gray40,
    resendCodeTimer: Colors.resendCodeTimer,
    statusLabel: Colors.Black,
    statusMessage: Colors.Gray40,
    blackIcon: Colors.Black,
    uncheckedIcon: Colors.uncheckedIcon,
    settingsLabel: Colors.Black,
    chevronRightColor: Colors.Grey,
    linearGradientStart: Colors.startColor,
    linearGradientEnd: Colors.endColor,
    linearIconGradientStart: Colors.startColor,
    linearIconGradientEnd: Colors.startColor,
    LinearGradientStroke: Colors.stroke,
    warningLogoBgColor: Colors.warningLogoBg,
    tooltipIcon: Colors.tooltip,
    toolTipPointerColor: Colors.toolTipPointer,
    urlLink: Colors.Purple,
    warningText: Colors.Red,
    PendingIcon: Colors.Yellow,
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
    fieldItemTitle: {
      backgroundColor: Colors.Transparent,
      fontSize: 11,
      fontFamily: 'Inter_400Regular',
    },
    fieldItemValue: {
      backgroundColor: Colors.Transparent,
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
      marginTop: 3,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    verificationStatus: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    statusLabel: {
      color: Colors.Gray30,
      fontSize: 12,
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    activationTab: {
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    kebabIcon: {
      flex: 3,
      height: '100%',
    },
    kebabPressableContainer: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      width: '15%',
    },
    verificationStatusIconContainer: {
      marginRight: 3,
    },
    verificationStatusIconInner: {
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
    vcDetailBg: {
      width: '100%',
      opacity: 0.1,
    },
    vcBg: {
      opacity: 0.1,
    },
    shimmer: {
      borderRadius: 5,
      marginLeft: 2,
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
      width: Dimensions.get('window').width * 0.12,
      height: Dimensions.get('window').height * 0.045,
      borderRadius: 6,
      backgroundColor: Colors.LightPurple,
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
      padding: 10,
      paddingRight: 20,
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
      backgroundColor: Colors.Grey,
      marginVertical: 8,
    },
    verticalLineWrapper: {
      display: 'flex',
      flex: 0.1,
      height: '100%',
      justifyContent: 'center',
    },
    vcActivationStatusContainer: {
      display: 'flex',
      flex: 7,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: 5,
    },
    vcActivationDetailsWrapper: {
      display: 'flex',
      alignItems: 'flex-start',
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
      borderColor: Colors.Purple,
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
    detailedViewActivationPopupContainer: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
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
      borderRadius: 10,
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
    welcomeLogo: {
      width: 185,
      height: 71,
    },
    injiLogo: {
      width: 105,
      height: 40,
    },
    injiHomeLogo: {
      marginLeft: 0,
    },
    logo: {
      height: 35,
      width: 35,
    },
    issuerLogo: {
      resizeMode: 'contain',
      aspectRatio: 1,
      height: 35,
    },
    vcDetailsLogo: {
      height: 65,
      width: 65,
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
    ProfileContainer: {
      position: 'relative',
    },
    ProfileIconContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: 40,
      height: 53,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.Mercury,
      backgroundColor: Colors.White,
    },
    ProfileIconPinnedStyle: {
      position: 'absolute',
    },
    IconContainer: {
      padding: 6,
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
      marginLeft: 10,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightPurple,
    },
    imageCaptureButton: {
      marginLeft: 130,
      marginRight: 50,
    },
    backArrowContainer: {
      padding: 6,
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightPurple,
    },
    receiveCardsContainer: {
      height: Dimensions.get('window').height * 0.14,
      width: Dimensions.get('window').width * 0.47,
      alignItems: 'center',
      borderBottomRightRadius: 0,
      padding: 15,
      marginVertical: 18,
      elevation: 1,
    },
    pinIcon: {
      height: 39,
      width: 39,
      marginLeft: -20,
      marginTop: -15,
    },
    infoIcon: {
      height: 39,
      width: 39,
      marginLeft: -13,
      marginTop: -9,
    },
    faceImage: {
      borderRadius: 10,
      height: 53,
      width: 40,
    },
    closeCardImage: {
      width: 40,
      height: 53,
      borderRadius: 100,
    },
    detailedViewImage: {
      width: 80,
      height: 106,
      borderRadius: 5,
      marginTop: 10,
    },
    openCardProfileIconContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: 100,
      height: 106,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Colors.Mercury,
      backgroundColor: Colors.White,
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
    idInputContainer: {
      width: Dimensions.get('window').width * 0.86,
    },
    idInputPicker: {
      width: Dimensions.get('window').width * 0.32,
      borderBottomWidth: 1,
      borderColor: isIOS() ? 'transparent' : Colors.Grey,
      bottom: isIOS() ? 50 : 20,
      height: isIOS() ? 100 : 'auto',
    },
    picker: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
    },
    idInputBottom: {
      position: 'relative',
      bottom: 18,
      borderBottomColor: Colors.Purple,
      borderBottomWidth: 1,
      minWidth: 210,
    },
    idInput: {
      position: 'relative',
      bottom: 18,
      minWidth: 210,
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
      borderBottomWidth: 1,
      marginTop: 10,
      marginLeft: 14,
      marginRight: 14,
      marginBottom: 20,
      opacity: 0.2,
    },
    hrLineFill: {
      borderBottomColor: Colors.platinumGrey,
      borderBottomWidth: 1.3,
    },
    downloadFabIconCopilotContainer: {
      height: 70,
      width: 70,
      borderRadius: 200,
      position: 'absolute',
      bottom: Dimensions.get('window').width * 0.1,
      right: Dimensions.get('window').width * 0.1,
    },
    downloadFabIconContainer: {
      height: 70,
      width: 70,
      borderRadius: 200,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      elevation: 5,
    },
    downloadFabIconNormal: {
      borderRadius: 200,
      height: 70,
      width: 70,
      justifyContent: 'center',
      position: 'absolute',
    },
    downloadFabIconPressed: {
      borderRadius: 200,
      height: 70,
      width: 70,
      backgroundColor: Colors.Purple,
      justifyContent: 'center',
      position: 'absolute',
    },
    boxShadow: generateBoxShadowStyle(),
    tooltipContainerStyle: {
      backgroundColor: '#FAFAFA',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      marginLeft: 15,
    },
    tooltipContentDescription: {
      color: Colors.toolTipContent,
      marginTop: 10,
    },
    tooltipHrLine: {
      borderBottomColor: Colors.Grey5,
      borderBottomWidth: 1,
      marginTop: 10,
    },
    introSliderHeader: {
      marginTop: isIOS()
        ? Constants.statusBarHeight + 40
        : StatusBar.currentHeight + 40,
      width: '100%',
      marginBottom: 50,
    },
    introSliderButton: {
      borderRadius: 10,
      height: 50,
      marginTop: -10,
    },
    keyboardAvoidStyle: {
      flex: 1,
      alignItems: 'center',
    },
    passwordKeyboardAvoidStyle: {
      flex: 1,
      backgroundColor: Colors.White,
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    newLabel: {
      backgroundColor: Colors.Purple,
      paddingHorizontal: 5,
      paddingVertical: 4,
      maxHeight: 20,
      marginTop: 10,
      borderRadius: 4,
      fontSize: 10,
      fontFamily: 'Inter_700Bold',
      lineHeight: 12,
    },
    scanLayoutHeaderContainer: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: I18nManager.isRTL ? 40 : 15,
      marginTop: 15,
    },
    scanLayoutHeaderTitle: {
      fontSize: 26,
      fontFamily: 'Inter_600SemiBold',
      paddingTop: isIOS() ? 10 : 20,
      paddingBottom: 10,
    },
    sendVcHeaderContainer: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: I18nManager.isRTL ? 50 : 0,
      marginTop: 15,
    },
    sendVPHeaderContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: I18nManager.isRTL ? 50 : 0,
    },
    sendVPHeaderTitle: {
      fontSize: 18,
      fontFamily: 'Inter_600SemiBold',
    },
    sendVPHeaderSubTitle: {
      fontSize: 13,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.LightPurple,
    },
    HistoryHeaderTitleStyle: {
      fontSize: 26,
      fontFamily: 'Inter_600SemiBold',
      marginTop: isIOS() ? 5 : 15,
    },
    tabBarIconCopilot: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 70,
      minHeight: 65,
      marginBottom: -5,
    },
    copilotStyle: {
      position: 'absolute',
      left: 10,
      right: 10,
      borderRadius: 8,
      maxWidth: Dimensions.get('screen').width,
      minHeight: Dimensions.get('screen').height * COPILOT_HEIGHT,
    },
    copilotButton: {
      width: 104,
      height: 40,
      marginLeft: 10,
    },
    copilotButtonsContainer: {
      marginTop: 25,
      marginBottom: 15,
    },
    copilotBgContainer: {
      flex: 1,
      justifyContent: 'space-around',
    },
  }),
  BannerStyles: StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: '#DB2E2E',
      width: '100%',
      position: 'relative',
      paddingHorizontal: 18,
      paddingVertical: 12,
      marginVertical: 1,
      columnGap: 7,
    },
    text: {
      textAlignVertical: 'center',
      fontSize: 12,
      lineHeight: 15,
      padding: 1,
      fontFamily: 'Inter_600SemiBold',
    },
    topBanner: {
      marginTop: 10,
      marginBottom: 10,
    },
    dismiss: {paddingLeft: 9},
    inProgress: {
      backgroundColor: Colors.OrangeBrown,
    },
    success: {
      backgroundColor: Colors.Green,
    },
    error: {
      backgroundColor: Colors.LightRed,
    },
  }),
  QrCodeStyles: StyleSheet.create({
    magnifierZoom: {
      backgroundColor: Colors.White,
      width: 27,
      height: 27,
      padding: 5,
      borderTopLeftRadius: 11,
      position: 'absolute',
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
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
      width: 80,
      height: 80,
      padding: 8,
      backgroundColor: Colors.White,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      marginTop: 14,
    },
    shareQrCodeButton: {
      marginTop: 30,
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
      height: 40,
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
      paddingTop: 5,
    },
    subHeader: {
      color: Colors.mediumLightGrayText,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 19,
      fontSize: 13,
      paddingTop: 4,
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
    helpHeader: {
      color: Colors.Black,
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 19,
      paddingTop: 5,
      margin: 7,
    },
    helpDetails: {
      margin: 5,
      color: Colors.Gray44,
      fontFamily: 'Inter_600SemiBold',
    },
    urlLinkText: {
      color: Colors.Purple,
      fontFamily: 'Inter_600SemiBold',
    },
    aboutDetails: {
      color: Colors.Black,
      fontSize: 18,
      margin: 7,
      lineHeight: 18,
    },
    error: {
      position: 'absolute',
      top: 30,
      left: 5,
      color: Colors.Red,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      minWidth: 200,
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
      fontSize: 15,
      justifyContent: 'center',
    },
    small: {
      fontSize: 13,
      lineHeight: 21,
    },
    mediumSmall: {
      fontSize: 15,
      lineHeight: 18,
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
      marginBottom: 2,
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
    heading: {
      flex: 1,
      flexDirection: 'column',
    },
  }),
  SearchBarStyles: StyleSheet.create({
    idleSearchBarBottomLine: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.Gray40,
    },
    searchBarContainer: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.Purple,
    },
    vcSearchBarContainer: {
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderTopWidth: 0.5,
      borderColor: Colors.DimGray,
      width: Dimensions.get('window').width,
      backgroundColor: Colors.White,
    },
    vcSearchIcon: {
      justifyContent: 'center',
      height: Dimensions.get('window').height * 0.055,
      width: Dimensions.get('window').width * 0.1,
      paddingLeft: 15,
    },
    searchIcon: {
      justifyContent: 'center',
      height: Dimensions.get('window').height * 0.055,
      width: Dimensions.get('window').width * 0.1,
    },
    searchBar: {
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      height: Dimensions.get('window').height * 0.055,
      width: Dimensions.get('window').width * 0.75,
    },
    clearSearch: {
      padding: 10,
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
    disabledOutlineButton: {
      backgroundColor: Colors.Transparent,
      color: Colors.Grey,
      borderColor: Colors.Grey,
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
      height: 54,
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
      borderWidth: 2,
      borderColor: Colors.TimeoutHintBoxBorder,
      borderRadius: 12,
    },
    sharedSuccessfully: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    sharedSuccessfullyIconStyle: {
      margin: 16,
      padding: 8,
      borderWidth: 2,
      borderColor: Colors.Purple,
      borderRadius: 30,
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
  BackupAndRestoreStyles: StyleSheet.create({
    backupProgressText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: Colors.Gray44,
    },
    actionOrLoaderContainer: {
      marginLeft: 1,
      marginRight: 1,
    },
    backupProcessInfo: {
      fontWeight: 'bold',
      paddingHorizontal: 20,
      textAlign: 'center',
      lineHeight: 22,
      fontSize: 17,
      fontFamily: 'Inter_600SemiBold',
      marginHorizontal: 30,
    },
    cloudInfo: {
      paddingHorizontal: 20,
      textAlign: 'center',
      paddingVertical: 15,
    },
    cloudLabel: {
      fontWeight: '600',
      paddingHorizontal: 10,
      textAlign: 'center',
      paddingTop: 15,
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 17,
      minHeight: 50,
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
      maxHeight: 300,
      position: 'absolute',
      bottom: 0,
    },
    kebabHeaderStyle: {
      justifyContent: 'space-between',
      fontFamily: 'Inter_700Bold',
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

  VerifyIdentityOverlayStyles: StyleSheet.create({
    content: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: Colors.White,
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
  IssuersScreenStyles: StyleSheet.create({
    issuerListOuterContainer: {
      padding: 10,
      flex: 1,
      backgroundColor: Colors.White,
    },
    issuersContainer: {
      marginHorizontal: 3,
      marginVertical: 5,
    },
    issuerBoxContainer: {
      margin: 5,
      flex: 1,
      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: Colors.White,
    },
    issuerBoxContainerPressed: {
      margin: 5,
      flex: 1,

      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: Colors.Grey,
    },
    issuerBoxContent: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
    },
    issuerBoxIconContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
    issuersSearchSubText: {
      marginBottom: 14,
      fontSize: 12,
      marginHorizontal: 9,
    },
    issuerHeading: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      paddingHorizontal: 3,
      marginBottom: 2,
      marginTop: 5,
    },
    issuerDescription: {
      fontSize: 11,
      lineHeight: 14,
      color: Colors.ShadeOfGrey,
      paddingTop: 1.4,
    },
  }),
  SendVcScreenStyles: StyleSheet.create({
    shareOptionButtonsContainer: {
      marginBottom: 1,
      marginTop: 1,
      rowGap: 8,
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
      marginBottom: 10,
    },
    message: {
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 25,
      marginHorizontal: 26,
      color: Colors.mediumDarkGrey,
    },
  }),
  SetupLanguageScreenStyle: StyleSheet.create({
    columnStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.White,
      maxHeight: Dimensions.get('window').height,
    },
  }),
  KeyManagementScreenStyle: StyleSheet.create({
    columnStyle: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    listItemTitle: {
      paddingTop: 3,
    },
    iconStyle: {
      marginRight: 15,
    },
    textStyle: {
      paddingRight: 10,
      paddingTop: 10,
    },
    outerViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingBottom: 10,
      backgroundColor: '#fff',
      elevation: 5, // For Android
      shadowColor: '#000', // For iOS
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 1,
    },
    heading: {
      color: 'black',
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 19,
      padding: 10,
    },
    copilotViewStyle: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: '#fff',
    },
    dragViewStyle: {
      padding: 10,
      marginBottom: 20,
      width: Dimensions.get('window').width * 0.8,
    },
    dragViewStyleSettingsScreen: {
      padding: 10,
      marginBottom: 20,
      width: Dimensions.get('window').width * 0.95,
    },
  }),
  HelpScreenStyle: StyleSheet.create({
    viewStyle: {
      borderRadius: 8,
      backgroundColor: Colors.LightPurple,
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 10,
      paddingTop: 10,
    },
    rowStyle: {
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
    },
    iconStyle: {
      paddingRight: 5,
    },
    labelStyle: {
      fontWeight: 'bold',
    },
  }),
  VPSharingStyles: StyleSheet.create({
    purposeContainer: {
      backgroundColor: Colors.TimeoutHintBoxColor,
      borderColor: Colors.TimeoutHintBoxBorder,
      borderWidth: 1,
      borderRadius: 5,
    },
    purposeText: {
      fontSize: 13,
      position: 'relative',
      fontFamily: 'Inter_500Medium',
    },
    cardsSelectedText: {
      fontFamily: 'Inter_500Medium',
      color: '#000000',
      fontSize: 14,
    },
    selectIDText: {
      position: 'relative',
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
    },
  }),
  CameraDisabledStyles: StyleSheet.create({
    container: {
      position: 'absolute',
      width: Dimensions.get('screen').width,
    },
    banner: {
      justifyContent: 'space-between',
      backgroundColor: Colors.Red,
      padding: 20,
      paddingHorizontal: 15,
      marginTop: -24,
    },
    bannerTextContainer: {
      justifyContent: 'space-between',
    },
    bannerTitle: {
      fontFamily: 'Inter_600SemiBold',
    },
    bannerGuide: {
      opacity: 0.8,
      fontFamily: 'Inter_400Regular',
    },
    bannerEnablePermissionContainer: {
      marginTop: 15,
    },
    bannerEnablePermission: {
      borderBottomWidth: 1.5,
      borderBottomColor: Colors.White,
      fontFamily: 'Inter_600SemiBold',
    },
    scannerContainer: {
      borderRadius: 24,
      height: 350,
      width: 320,
      marginTop: 40,
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.Gray89,
    },
  }),
  CameraEnabledStyles: StyleSheet.create({
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
    guideContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    guideContentContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 9,
      width: Dimensions.get('window').width * 0.85,
      alignItems: 'center',
      marginTop: Dimensions.get('window').height * 0.12,
      padding: 3,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#ffffff',
      borderRadius: 9,
      width: Dimensions.get('window').width * 0.3,
      alignSelf: 'center',
      alignItems: 'center',
      height: 40,
      marginBottom: Dimensions.get('window').height * 0.1,
    },
    holdPhoneSteadyText: {
      color: Colors.Black,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
    },
    cameraFlipIcon: {
      height: 50,
      width: 50,
    },
    iconText: {fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 6},
  }),
  BottomTabBarStyle: StyleSheet.create({
    headerRightContainerStyle: {paddingEnd: 13},
    headerLeftContainerStyle: {paddingEnd: 13},
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    tabBarStyle: {
      display: 'flex',
      height: 75,
      paddingHorizontal: 10,
    },
    tabBarItemStyle: {
      height: 83,
      padding: 11,
    },
  }),

  AboutInjiScreenStyle: StyleSheet.create({
    titleStyle: {
      paddingTop: 3,
    },
    appIdTitleStyle: {
      maxWidth: 110,
      paddingTop: i18next.language == 'kn' || i18next.language == 'hi' ? 5 : 0,
    },
    appIdTextStyle: {
      paddingTop: i18next.language == 'hi' ? 2 : 0,
    },
    containerStyle: {
      flex: 1,
      padding: 12,
    },
    innerContainerStyle: {
      maxWidth: Dimensions.get('window').width * 0.94,
      minHeight: Dimensions.get('window').height * 0.1,
      marginTop: 7,
    },
    clickHereTextStyle: {
      maxWidth: 150,
      paddingTop: 3,
    },
    injiVersionContainerStyle: {
      paddingBottom: 15,
    },
    injiVersionTitle: {
      paddingTop: 3,
    },
    injiVersionText: {
      paddingTop: 3,
      maxWidth: 250,
    },
    tuvaliVerisonStyle: {
      paddingTop: 3,
      paddingBottom: 12,
      marginTop: 3,
    },
    horizontalLineStyle: {
      backgroundColor: 'lightgrey',
      width: '90%',
      height: 1,
    },
    poweredByTextStyle: {
      paddingTop: 15,
      maxWidth: 250,
    },
    aboutDetailstextStyle: {
      color: Colors.Black,
      fontSize: 18,
      margin: 7,
      lineHeight: 18,
      paddingTop: 5,
    },
    moreDetailstextStyle: {
      color: Colors.Black,
      fontSize: 18,
      margin: 7,
      lineHeight: 18,
      maxWidth: 150,
      paddingTop: 10,
    },
  }),

  ICON_SMALL_SIZE: 16,
  ICON_MID_SIZE: 22,
  ICON_LARGE_SIZE: 33,
  CloseCard: require('../../../assets/Card_Bg1.png'),
  OpenCard: require('../../../assets/Card_Bg1.png'),
  IntroWelcome: require('../../../assets/Intro_Unlock.png'),
  SecureSharing: require('../../../assets/Intro_Secure_Sharing.png'),
  DigitalWallet: require('../../../assets/Intro_Wallet.png'),
  IntroShare: require('../../../assets/Intro_Share.png'),
  IntroBackup: require('../../../assets/Intro_Backup.png'),
  IntroSliderbackground: require('../../../assets/IntroSliderBackgroundPurple.png'),
  HomeScreenLogo: HomeScreenLogo,
  InjiLogoSmall: InjiLogoSmall,
  elevation(level: ElevationLevel): ViewStyle {
    // https://ethercreative.github.io/react-native-shadow-generator/

    if (level === 0) {
      return {};
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
  LinearGradientDirection: {
    start: {x: 0.5, y: 0.5},
    end: {x: 0.5, y: 1},
  },
};

function generateBoxShadowStyle() {
  if (isIOS()) {
    return {
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 1.2},
      shadowOpacity: 0.3,
      shadowRadius: 2.5,
    };
  }
  return {
    elevation: 4,
    shadowColor: '#000',
  };
}
