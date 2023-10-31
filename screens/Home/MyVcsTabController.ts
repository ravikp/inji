import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {ActorRefFrom} from 'xstate';
import {
  selectIsRefreshingMyVcs,
  selectMyVcsMetadata,
  selectWalletBindingSuccess,
  VcEvents,
  selectAreAllVcsDownloaded,
  selectInProgressVcDownloads,
  selectIsTampered,
  selectIsDownloadLimitExpired,
  selectDownloadingFailedVcs,
} from '../../machines/vc';
import {
  selectWalletBindingError,
  selectShowWalletBindingError,
} from '../../machines/VCItemMachine/commonSelectors';
import {ExistingMosipVCItemMachine} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {GlobalContext} from '../../shared/GlobalContext';
import {HomeScreenTabProps} from './HomeScreen';
import {
  MyVcsTabEvents,
  MyVcsTabMachine,
  selectAddVcModal,
  selectIsRequestSuccessful,
  selectGetVcModal,
  selectIsSavingFailedInIdle,
  selectIsNetworkOff,
} from './MyVcsTabMachine';
import {
  selectShowHardwareKeystoreNotExistsAlert,
  SettingsEvents,
} from '../../machines/settings';
import {EsignetMosipVCItemMachine} from '../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

export function useMyVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVcsTabMachine>;
  const {appService} = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const settingsService = appService.children.get('settings');

  return {
    service,
    AddVcModalService: useSelector(service, selectAddVcModal),
    GetVcModalService: useSelector(service, selectGetVcModal),

    vcMetadatas: useSelector(vcService, selectMyVcsMetadata),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),
    isSavingFailedInIdle: useSelector(service, selectIsSavingFailedInIdle),
    walletBindingError: useSelector(service, selectWalletBindingError),
    isBindingError: useSelector(service, selectShowWalletBindingError),
    isBindingSuccess: useSelector(vcService, selectWalletBindingSuccess),
    isNetworkOff: useSelector(service, selectIsNetworkOff),
    showHardwareKeystoreNotExistsAlert: useSelector(
      settingsService,
      selectShowHardwareKeystoreNotExistsAlert,
    ),
    areAllVcsLoaded: useSelector(vcService, selectAreAllVcsDownloaded),
    inProgressVcDownloads: useSelector(vcService, selectInProgressVcDownloads),

    isTampered: useSelector(vcService, selectIsTampered),

    isDownloadLimitExpires: useSelector(
      vcService,
      selectIsDownloadLimitExpired,
    ),

    downloadFailedVcs: useSelector(vcService, selectDownloadingFailedVcs),

    SET_STORE_VC_ITEM_STATUS: () =>
      service.send(MyVcsTabEvents.SET_STORE_VC_ITEM_STATUS()),

    RESET_STORE_VC_ITEM_STATUS: () =>
      service.send(MyVcsTabEvents.RESET_STORE_VC_ITEM_STATUS()),

    RESET_ARE_ALL_VCS_DOWNLOADED: () =>
      vcService.send(VcEvents.RESET_ARE_ALL_VCS_DOWNLOADED()),

    DISMISS: () => service.send(MyVcsTabEvents.DISMISS()),

    TRY_AGAIN: () => service.send(MyVcsTabEvents.TRY_AGAIN()),

    DOWNLOAD_ID: () => service.send(MyVcsTabEvents.ADD_VC()),

    GET_VC: () => service.send(MyVcsTabEvents.GET_VC()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    VIEW_VC: (
      vcRef:
        | ActorRefFrom<typeof ExistingMosipVCItemMachine>
        | ActorRefFrom<typeof EsignetMosipVCItemMachine>,
    ) => {
      return service.send(MyVcsTabEvents.VIEW_VC(vcRef));
    },

    DISMISS_WALLET_BINDING_NOTIFICATION_BANNER: () =>
      vcService?.send(VcEvents.RESET_WALLET_BINDING_SUCCESS()),

    ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS: () =>
      settingsService.send(SettingsEvents.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS()),

    REMOVE_TAMPERED_VCS: () => vcService?.send(VcEvents.REMOVE_TAMPERED_VCS()),
    DELETE_VC: () => vcService?.send(VcEvents.DELETE_VC()),
  };
}
