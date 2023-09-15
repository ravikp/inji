import { EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { log, respond } from 'xstate/lib/actions';
import { VcItemEvents } from './vcItem';
import { MY_VCS_STORE_KEY, RECEIVED_VCS_STORE_KEY } from '../shared/constants';
import { VCMetadata } from '../shared/VCMetadata';
import { OpenId4VCIProtocol } from '../shared/openId4VCI/Utils';
import { VCItemEvents } from '../components/openId4VCI/VCItemMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    myVcs: [] as VCMetadata[],
    receivedVcs: [] as VCMetadata[],
    vcs: {} as Record<string, VC>,
  },
  {
    events: {
      VIEW_VC: (vc: VC) => ({ vc }),
      GET_VC_ITEM: (vcMetadata: VCMetadata) => ({ vcMetadata }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      VC_ADDED: (vcMetadata: VCMetadata) => ({ vcMetadata }),
      REMOVE_VC_FROM_CONTEXT: (vcMetadata: VCMetadata) => ({ vcMetadata }),
      VC_UPDATED: (vcMetadata: VCMetadata) => ({ vcMetadata }),
      VC_RECEIVED: (vcMetadata: VCMetadata) => ({ vcMetadata }),
      VC_DOWNLOADED: (vc: VC) => ({ vc }),
      VC_DOWNLOADED_FROM_OPENID4VCI: (vc: VC, vcMetadata: VCMetadata) => ({ vc, vcKey }),
      VC_UPDATE: (vc: VC) => ({ vc }),
      REFRESH_MY_VCS: () => ({}),
      REFRESH_MY_VCS_TWO: (vc: VC) => ({ vc }),
      REFRESH_RECEIVED_VCS: () => ({}),
      GET_RECEIVED_VCS: () => ({}),
    },
  }
);

export const VcEvents = model.events;

export const vcMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGA6AlgO0wF3QFsBPANVVgGIBlAFQHkAlAUQH0XqAFegOWucSgADgHtY+TCOyCQAD0QBmABwAmdAEYALCoCsANgAMOgJx6dAdnNmANCGKIlBvemWbLKvcc06FVgL5+tmhYuAQATmCoYJjIkORUdExsHNx8AkggouJ4ktIZ8gjKalq65qrmmup6SpqatvYI6k6a6HoKmko6OkpK5sb9AUEYEQCGEMREZBRYEAA2YJQsAGIcABKsALIAmqykAMLUMlkSUjIF6uom6JV6ujrqxo7qZfWITRUamgpOKubdWuYVIMQMFRuNJvF0BEAGYRWAACxwUBoDBY7GYXF4-COYhOeVA50u5nQxh8fyKCm6uleCFMxKayjaBgUCjaFmBoLAYwmESiMTi00wcwWyzW6L2zAAkqRmAARXYHHHZXJnN7qXwacwGAyVJymJTqGnqlnoToqFS+XzqA1ODnDLng3nRWIQSEwuGI7DIxJolJY9LCXE5U75NV6dToJy+YwGXrGFRuI0WiNKUnqvS3LwGcwKO1Qh3ESgAcWYtHFUpl8v2hwyx2D+LkbxUplangzPVumhjdTsiEMBg0XWb6rp1vMebBhZLZf2rEltGYGyVeNVjQuEeZvi1zO1Nl7CH7g50w4Uo56E4LlFnAEFZbK5cv66vjAoI1ahyz9OSaYfLsfjCOejmGOF7cleeysLK9AAOo8AAMvQt4PrWQYqqGjTHgokbxhaKgPF46gqEoP7akeug1H0x7aKB4zgeW0rIYGyohgSfa6C4NRVO0mh6DxlQ0n8OitE0mhOD4OpuLmwLYCIEBwDIwQ4PgEIUI+aGsYU1ToBY0baM2Si3LxP5WJGNTNgYeFUgMgQghgSnhJEzoCvAKHMQ2BTtPSRg6o4omVBUNIAcUqgKCoTg9DqJh5vZaksY2hQWho3kdDqOrPD2DSGFhsbaAZDyAjxNETCQkJCvMsXuYgjzOOafxakorJuBaRoWUJ3wWRUHQ+AZehFSpsD5rCcCelAFWriOKbtg1XUmC8+79MYpras2Zj9H0CZ9SVqmuSu6GmGotUWLGjWAgoNKpi0DIhfoFhmFJQz5ty+Z8i6pXCmNe2dBoZj3BZlw1KyRqvhGGYWGtxhlAZSh9U6-KutM7rDUiH0aSOag+I8zQ-N4SYGd9VIPIRzZETDjlw-EKPxaYEZVF0TSWQDehGv9pqkgYENVJcvhFZTBQvvSP30-9XxM-ulgDldvjVA15qaHavOIM2i1NDoPmpf5GWIMe9JDjotSGFm6gBAEQA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./vc.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'vc',
      initial: 'init',
      states: {
        init: {
          on: {
            REFRESH_MY_VCS: {
              target: '#vc.ready.myVcs.refreshing',
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
                  target: '#vc.ready',
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
                idle: {
                  on: {
                    REFRESH_RECEIVED_VCS: {
                      target: 'refreshing',
                    },
                  },
                },
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
            GET_RECEIVED_VCS: {
              actions: 'getReceivedVcsResponse',
            },
            GET_VC_ITEM: {
              actions: 'getVcItemResponse',
            },
            VC_ADDED: {
              actions: 'prependToMyVcs',
            },
            REMOVE_VC_FROM_CONTEXT: {
              actions: 'removeVcFromMyVcs',
            },
            VC_UPDATED: {
              actions: ['updateMyVcs', 'setUpdatedVcMetadatas'],
            },
            VC_DOWNLOADED: {
              actions: 'setDownloadedVc',
            },
            VC_DOWNLOADED_FROM_OPENID4VCI: {
              actions: 'setDownloadedVCFromOpenId4VCI',
            },
            VC_UPDATE: {
              actions: 'setVcUpdate',
            },
            VC_RECEIVED: [
              {
                actions: 'moveExistingVcToTop',
                cond: 'hasExistingReceivedVc',
              },
              {
                actions: 'prependToReceivedVcs',
              },
            ],
          },
        },
      },
    },
    {
      actions: {
        getReceivedVcsResponse: respond((context) => ({
          type: 'VC_RESPONSE',
          response: context.receivedVcs,
        })),

        getVcItemResponse: respond((context, event) => {
          const vc = context.vcs[event.vcMetadata?.uniqueId()];
          if (event.protocol === OpenId4VCIProtocol) {
            return VCItemEvents.GET_VC_RESPONSE(vc);
          }
          return VcItemEvents.GET_VC_RESPONSE(vc);
        }),

        loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
          to: (context) => context.serviceRefs.store,
        }),

        loadReceivedVcs: send(StoreEvents.GET(RECEIVED_VCS_STORE_KEY), {
          to: (context) => context.serviceRefs.store,
        }),

        setMyVcs: model.assign({
          myVcs: (_context, event) => {
            return parseMetadata((event.response || []) as string[]);
          },
        }),

        setReceivedVcs: model.assign({
          receivedVcs: (_context, event) => {
            return parseMetadata((event.response || []) as string[]);
          },
        }),

        setDownloadedVc: (context, event) => {
          const vcUniqueId = VCMetadata.fromVC(event.vc, true).uniqueId();
          context.vcs[vcUniqueId] = event.vc;
        },
        setDownloadedVCFromOpenId4VCI: (context, event) => {
          if (event?.vc.credential != null)
            context.vcs[event?.vcMetadata] = event?.vc.credential;
        },
        setVcUpdate: (context, event) => {
          Object.keys(context.vcs).map((vcUniqueId) => {
            const eventVCMetadata = VCMetadata.fromVC(event.vc, true);

            if (vcUniqueId === eventVCMetadata.uniqueId()) {
              context.vcs[eventVCMetadata.uniqueId()] = context.vcs[vcUniqueId];
              delete context.vcs[vcUniqueId];
              return context.vcs[eventVCMetadata.uniqueId()];
            }
          });
        },

        setUpdatedVcMetadatas: send(
          (_context, event) => {
            return StoreEvents.UPDATE(
              MY_VCS_STORE_KEY,
              JSON.stringify(event.vcMetadata)
            );
          },
          { to: (context) => context.serviceRefs.store }
        ),

        prependToMyVcs: model.assign({
          myVcs: (context, event) => [event.vcMetadata, ...context.myVcs],
        }),

        removeVcFromMyVcs: model.assign({
          myVcs: (context, event) =>
            context.myVcs.filter(
              (vc: VCMetadata) => !vc.equals(event.vcMetadata)
            ),
        }),

        updateMyVcs: model.assign({
          myVcs: (context, event) =>
            [
              event.vcMetadata,
              ...context.myVcs.map((value) => {
                if (!value.equals(event.vcMetadata)) {
                  return value;
                }
              }),
            ].filter((value) => value != undefined),
        }),

        prependToReceivedVcs: model.assign({
          receivedVcs: (context, event) => [
            event.vcMetadata,
            ...context.receivedVcs,
          ],
        }),

        moveExistingVcToTop: model.assign({
          receivedVcs: (context, event) => {
            return [
              event.vcMetadata,
              ...context.receivedVcs.filter((value) =>
                value.equals(event.vcMetadata)
              ),
            ];
          },
        }),
      },

      guards: {
        hasExistingReceivedVc: (context, event) =>
          context.receivedVcs.find((vcMetadata) =>
            vcMetadata.equals(event.vcMetadata)
          ) != null,
      },
    }
  );

export function createVcMachine(serviceRefs: AppServices) {
  return vcMachine.withContext({
    ...vcMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof vcMachine>;

export function selectMyVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs;
}

export function selectShareableVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs.filter(
    (vcMetadata) => state.context.vcs[vcMetadata.uniqueId()]?.credential != null
  );
}

export function selectReceivedVcsMetadata(state: State): VCMetadata[] {
  return state.context.receivedVcs;
}

export function selectIsRefreshingMyVcs(state: State) {
  return state.matches('ready.myVcs.refreshing');
}

export function selectIsRefreshingReceivedVcs(state: State) {
  return state.matches('ready.receivedVcs.refreshing');
}

/*
  this methods returns all the binded vc's in the wallet.
 */
export function selectBindedVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs.filter((vcMetadata) => {
    const walletBindingResponse =
      state.context.vcs[vcMetadata.uniqueId()]?.walletBindingResponse;
    return (
      !isEmpty(walletBindingResponse) &&
      !isEmpty(walletBindingResponse?.walletBindingId)
    );
  });
}

function isEmpty(object) {
  return object == null || object == '' || object == undefined;
}

function parseMetadata(metadataStrings: string[]) {
  try {
    return metadataStrings.map((s) => JSON.parse(s) as VCMetadata);
  } catch (e) {
    console.error('Failed to parse VC Metadata', e);
    return [];
  }
}
