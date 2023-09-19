import {ActorRefFrom, assign, EventFrom, send, spawn, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {ExistingMosipVCItemMachine} from '../../components/VC/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {AppServices} from '../../shared/GlobalContext';
import {createMyVcsTabMachine, MyVcsTabMachine} from './MyVcsTabMachine';
import {
  createReceivedVcsTabMachine,
  ReceivedVcsTabMachine,
} from './ReceivedVcsTabMachine';
import {IssuersMachine} from '../../machines/issuersMachine';
import {EsignetMosipVCItemMachine} from '../../components/VC/EsignetMosipVCItem/EsignetMosipVCItemMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    tabRefs: {
      myVcs: {} as ActorRefFrom<typeof MyVcsTabMachine>,
      receivedVcs: {} as ActorRefFrom<typeof ReceivedVcsTabMachine>,
    },
    selectedVc: null as
      | ActorRefFrom<typeof ExistingMosipVCItemMachine>
      | ActorRefFrom<typeof EsignetMosipVCItemMachine>,
    activeTab: 0,
  },
  {
    events: {
      SELECT_MY_VCS: () => ({}),
      SELECT_RECEIVED_VCS: () => ({}),
      SELECT_HISTORY: () => ({}),
      VIEW_VC: (
        vcItemActor:
          | ActorRefFrom<typeof ExistingMosipVCItemMachine>
          | ActorRefFrom<typeof EsignetMosipVCItemMachine>,
      ) => ({
        vcItemActor,
      }),
      DISMISS_MODAL: () => ({}),
      GOTO_ISSUERS: () => ({}),
      DOWNLOAD_ID: () => ({}),
    },
  },
);

const MY_VCS_TAB_REF_ID = 'myVcsTab';
const RECEIVED_VCS_TAB_REF_ID = 'receivedVcsTab';

export const HomeScreenEvents = model.events;

export type TabRef =
  | ActorRefFrom<typeof MyVcsTabMachine>
  | ActorRefFrom<typeof ReceivedVcsTabMachine>;

export const HomeScreenMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./HomeScreenMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'HomeScreen',
    type: 'parallel',
    states: {
      tabs: {
        id: 'tabs',
        initial: 'init',
        on: {
          SELECT_MY_VCS: '.myVcs',
          SELECT_RECEIVED_VCS: '.receivedVcs',
          SELECT_HISTORY: '.history',
          GOTO_ISSUERS: '.gotoIssuers',
        },
        states: {
          init: {
            entry: ['spawnTabActors'],
            after: {
              100: 'myVcs',
            },
          },
          myVcs: {
            entry: [setActiveTab(0)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: context => context.tabRefs.myVcs,
                  }),
                ],
              },
            },
          },
          receivedVcs: {
            entry: [setActiveTab(1)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: context => context.tabRefs.receivedVcs,
                  }),
                ],
              },
            },
          },
          history: {
            entry: [setActiveTab(2)],
          },
          gotoIssuers: {
            invoke: {
              id: 'issuersMachine',
              src: IssuersMachine,
              data: context => ({
                ...IssuersMachine.context,
                serviceRefs: context.serviceRefs, // the value you want to pass to child machine
              }),
              onDone: 'idle',
            },
            on: {
              DOWNLOAD_ID: {
                actions: 'sendAddEvent',
                target: 'idle',
              },
              GOTO_ISSUERS: 'gotoIssuers',
            },
          },
          idle: {
            on: {
              GOTO_ISSUERS: 'gotoIssuers',
            },
          },
        },
      },
      modals: {
        initial: 'none',
        states: {
          none: {
            entry: ['resetSelectedVc'],
            on: {
              VIEW_VC: {
                target: 'viewingVc',
                actions: ['setSelectedVc'],
              },
            },
          },
          viewingVc: {
            on: {
              DISMISS_MODAL: 'none',
            },
          },
        },
      },
    },
  },
  {
    actions: {
      spawnTabActors: assign({
        tabRefs: context => ({
          myVcs: spawn(
            createMyVcsTabMachine(context.serviceRefs),
            MY_VCS_TAB_REF_ID,
          ),
          receivedVcs: spawn(
            createReceivedVcsTabMachine(context.serviceRefs),
            RECEIVED_VCS_TAB_REF_ID,
          ),
        }),
      }),
      sendAddEvent: send('ADD_VC', {
        to: context => context.tabRefs.myVcs,
      }),

      setSelectedVc: model.assign({
        selectedVc: (_, event) => event.vcItemActor,
      }),

      resetSelectedVc: model.assign({
        selectedVc: null,
      }),
    },
  },
);

function setActiveTab(activeTab: number) {
  return model.assign({activeTab});
}

type State = StateFrom<typeof HomeScreenMachine>;

export function selectIssuersMachine(state: State) {
  return state.children.issuersMachine as ActorRefFrom<typeof IssuersMachine>;
}
export function selectTabRefs(state: State) {
  return state.context.tabRefs;
}

export function selectActiveTab(state: State) {
  return state.context.activeTab;
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectViewingVc(state: State) {
  return state.matches('modals.viewingVc');
}

export function selectTabsLoaded(state: State) {
  return !state.matches('tabs.init');
}
