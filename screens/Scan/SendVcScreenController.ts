import {useSelector} from '@xstate/react';
import {useContext, useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {selectShareableVcsMetadata} from '../../machines/VCItemMachine/vc';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectCredential,
  selectIsSelectingVc,
  selectReceiverInfo,
  selectSelectedVc,
  selectVcName,
  selectVerifiableCredentialData,
} from '../../machines/bleShare/scan/selectors';
import {
  selectIsCancelling,
  selectIsInvalidIdentity,
  selectIsVerifyingIdentity,
} from '../../machines/bleShare/commonSelectors';
import {
  ScanEvents,
  selectIsFaceVerificationConsent,
} from '../../machines/bleShare/scan/scanMachine';
import {VCShareFlowType} from '../../shared/Utils';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {VCItemMachine} from '../../machines/VCItemMachine/VCItemMachine';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

export function useSendVcScreen() {
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan')!!;
  const vcService = appService.children.get('vc')!!;
  const navigation = useNavigation<MyVcsTabNavigation>();

  const [selectedIndex, setSelectedIndex] = useState<number>(null);

  return {
    selectedIndex,
    receiverInfo: useSelector(scanService, selectReceiverInfo),
    vcName: useSelector(scanService, selectVcName),
    shareableVcsMetadata: useSelector(vcService, selectShareableVcsMetadata),
    selectedVc: useSelector(scanService, selectSelectedVc),
    isSelectingVc: useSelector(scanService, selectIsSelectingVc),
    isVerifyingIdentity: useSelector(scanService, selectIsVerifyingIdentity),
    isInvalidIdentity: useSelector(scanService, selectIsInvalidIdentity),
    isCancelling: useSelector(scanService, selectIsCancelling),
    isFaceVerificationConsent: useSelector(
      scanService,
      selectIsFaceVerificationConsent,
    ),
    credential: useSelector(scanService, selectCredential),
    verifiableCredentialData: useSelector(
      scanService,
      selectVerifiableCredentialData,
    ),
    CANCEL: () => scanService.send(ScanEvents.CANCEL()),
    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    FACE_VERIFICATION_CONSENT: (isConsentGiven: boolean) =>
      scanService.send(ScanEvents.FACE_VERIFICATION_CONSENT(isConsentGiven)),
    VERIFY_AND_ACCEPT_REQUEST: () =>
      scanService.send(ScanEvents.VERIFY_AND_ACCEPT_REQUEST()),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => scanService.send(ScanEvents.FACE_VALID()),
    FACE_INVALID: () => scanService.send(ScanEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => scanService.send(ScanEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
    TOGGLE_USER_CONSENT: () =>
      scanService.send(ScanEvents.TOGGLE_USER_CONSENT()),
    SELECT_VC_ITEM:
      (index: number) => (vcRef: ActorRefFrom<typeof VCItemMachine>) => {
        setSelectedIndex(index);
        const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
        scanService.send(
          ScanEvents.SELECT_VC(vcData, VCShareFlowType.SIMPLE_SHARE),
        );
      },
  };
}
