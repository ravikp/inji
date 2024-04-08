import {EventFrom, send, sendParent} from 'xstate';
import {AppServices} from '../../../shared/GlobalContext';
import {log} from 'xstate/lib/actions';
import {VCMetamodel} from './VCMetaModel';
import {VCMetaActions} from './VCMetaActions';
import {VCMetaGaurds} from './VCMetaGuards';
import {VCMetaServices} from './VCMetaServices';

const model = VCMetamodel;
const machineName = 'vcMeta';

export const VcMetaEvents = model.events;

export const vcMetaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGA6AlgO0wF3QFsBPANVVgGIBlAFQHkAlAUQH0XqAFegOWucSgADgHtY+TCOyCQAD0QBmABwAmdAEYALCoCsANgAMOgJx6dAdnNmANCGKIlBvemWbLKvcc06FVgL5+tmhYuAQATmCoYJjIkORUdExsHNx8AkggouJ4ktIZ8gjKalq65qrmmup6SpqatvYI6k6a6HoKmko6OkpK5sb9AUEYEQCGEMREZBRYEAA2YJQsAGIcABKsALIAmqykAMLUMlkSUjIF6uom6JV6ujrqxo7qZfWITRUamgpOKubdWuYVIMQMFRuNJvF0BEAGYRWAACxwUBoDBY7GYXF4-COYhOeVA50u5nQxh8fyKCm6uleCFMxKayjaBgUCjaFmBoLAYwmESiMTi00wcwWyzW6L2zAAkqRmAARXYHHHZXJnN7qXwacwGAyVJymJTqGnqlnoToqFS+XzqA1ODnDLng3nRWIQSEwuGI7DIxJolJY9LCXE5U75NV6dToJy+YwGXrGFRuI0WiNKUnqvS3LwGcwKO1Qh3ESgAcWYtHFUpl8v2hwyx2D+LkbxUplangzPVumhjdTsiEMBg0XWb6rp1vMebBhZLZf2rEltGYGyVeNVjQuEeZvi1zO1Nl7CH7g50w4Uo56E4LlFnAEFZbK5cv66vjAoI1ahyz9OSaYfLsfjCOejmGOF7cleeysLK9AAOo8AAMvQt4PrWQYqqGjTHgokbxhaKgPF46gqEoP7akeug1H0x7aKB4zgeW0rIYGyohgSfa6C4NRVO0mh6DxlQ0n8OitE0mhOD4OpuLmwLYCIEBwDIwQ4PgEIUI+aGsYU1ToBY0baM2Si3LxP5WJGNTNgYeFUgMgQghgSnhJEzoCvAKHMQ2BTtPSRg6o4omVBUNIAcUqgKCoTg9DqJh5vZaksY2hQWho3kdDqOrPD2DSGFhsbaAZDyAjxNETCQkJCvMsXuYgjzOOafxakorJuBaRoWUJ3wWRUHQ+AZehFSpsD5rCcCelAFWriOKbtg1XUmC8+79MYpras2Zj9H0CZ9SVqmuSu6GmGotUWLGjWAgoNKpi0DIhfoFhmFJQz5ty+Z8i6pXCmNe2dBoZj3BZlw1KyRqvhGGYWGtxhlAZSh9U6-KutM7rDUiH0aSOag+I8zQ-N4SYGd9VIPIRzZETDjlw-EKPxaYEZVF0TSWQDehGv9pqkgYENVJcvhFZTBQvvSP30-9XxM-ulgDldvjVA15qaHavOIM2i1NDoPmpf5GWIMe9JDjotSGFm6gBAEQA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./VCMetaMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: machineName,
      initial: 'init',
      states: {
        init: {
          on: {
            REFRESH_MY_VCS: {
              target: '#vcMeta.ready.myVcs.refreshing',
            },
          },
          initial: 'myVcs',
          states: {
            myVcs: {
              entry: 'loadMyVcs',
              on: {
                STORE_RESPONSE: {
                  actions: 'setMyVcs',
                  target: 'receivedVcs',
                },
              },
            },
            receivedVcs: {
              entry: 'loadReceivedVcs',
              on: {
                STORE_RESPONSE: {
                  actions: 'setReceivedVcs',
                  target: '#vcMeta.ready',
                },
              },
            },
          },
        },
        ready: {
          entry: sendParent('READY'),
          type: 'parallel',
          states: {
            myVcs: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    REFRESH_MY_VCS: {
                      actions: [log('REFRESH_MY_VCS:myVcs---')],
                      target: 'refreshing',
                    },
                    WALLET_BINDING_SUCCESS: {
                      actions: 'setWalletBindingSuccess',
                    },
                  },
                },
                refreshing: {
                  entry: 'loadMyVcs',
                  on: {
                    STORE_RESPONSE: {
                      actions: 'setMyVcs',
                      target: 'idle',
                    },
                  },
                },
              },
            },
            receivedVcs: {
              initial: 'idle',
              states: {
                idle: {},
                refreshing: {
                  entry: 'loadReceivedVcs',
                  on: {
                    STORE_RESPONSE: {
                      actions: 'setReceivedVcs',
                      target: 'idle',
                    },
                  },
                },
              },
            },
          },
          on: {
            GET_VC_ITEM: {
              actions: 'getVcItemResponse',
            },
            VC_ADDED: {
              actions: 'prependToMyVcs',
            },
            REMOVE_VC_FROM_CONTEXT: {
              actions: 'removeVcFromMyVcs',
            },
            VC_METADATA_UPDATED: {
              actions: ['updateMyVcs', 'setUpdatedVcMetadatas'],
            },
            VC_DOWNLOADED: {
              actions: 'setDownloadedVc',
            },
            ADD_VC_TO_IN_PROGRESS_DOWNLOADS: {
              actions: 'addVcToInProgressDownloads',
            },
            REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS: {
              actions: 'removeVcFromInProgressDownlods',
            },
            RESET_IN_PROGRESS_VCS_DOWNLOADED: {
              actions: 'resetInProgressVcsDownloaded',
            },
            RESET_WALLET_BINDING_SUCCESS: {
              actions: 'resetWalletBindingSuccess',
            },
            REFRESH_RECEIVED_VCS: {
              target: '#vcMeta.ready.receivedVcs.refreshing',
            },
            TAMPERED_VC: {
              actions: 'setTamperedVcs',
              target: 'tamperedVCs',
            },
            DOWNLOAD_LIMIT_EXPIRED: {
              actions: [
                'removeVcFromInProgressDownlods',
                'setDownloadingFailedVcs',
              ],
              target: '#vcMeta.ready.myVcs.refreshing',
            },
            DELETE_VC: {
              target: 'deletingFailedVcs',
            },
            VERIFY_VC_FAILED: {
              actions: [
                'removeVcFromInProgressDownlods',
                'setVerificationErrorMessage',
              ],
              target: '#vcMeta.ready.myVcs.refreshing',
            },
            RESET_VERIFY_ERROR: {
              actions: 'resetVerificationErrorMessage',
            },
          },
        },
        tamperedVCs: {
          initial: 'idle',
          on: {
            REMOVE_TAMPERED_VCS: {
              target: '.triggerAutoBackupForTamperedVcDeletion',
            },
          },
          states: {
            idle: {},
            triggerAutoBackupForTamperedVcDeletion: {
              invoke: {
                src: 'isUserSignedAlready',
                onDone: [
                  {
                    cond: 'isSignedIn',
                    actions: 'sendBackupEvent',
                    target: 'refreshVcsMetadata',
                  },
                  {
                    target: 'refreshVcsMetadata',
                  },
                ],
              },
            },
            refreshVcsMetadata: {
              entry: ['logTamperedVCsremoved', send('REFRESH_VCS_METADATA')],
              on: {
                REFRESH_VCS_METADATA: {
                  target: '#vcMeta.init',
                },
              },
            },
          },
        },
        deletingFailedVcs: {
          entry: 'removeDownloadFailedVcsFromStorage',
          on: {
            STORE_RESPONSE: {
              actions: [
                'removeDownloadingFailedVcsFromMyVcs',
                'resetDownloadFailedVcs',
              ],
              target: '#vcMeta.ready.myVcs.refreshing',
            },
          },
        },
      },
    },
    {
      actions: VCMetaActions(model),
      guards: VCMetaGaurds(),
      services: VCMetaServices(),
    },
  );

export function createVcMetaMachine(serviceRefs: AppServices) {
  return vcMetaMachine.withContext({
    ...vcMetaMachine.context,
    serviceRefs,
  });
}
