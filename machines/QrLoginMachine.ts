import {
  ActorRefFrom,
  assign,
  EventFrom,
  send,
  sendParent,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { MY_VCS_STORE_KEY, ESIGNET_BASE_URL } from '../shared/constants';
import { StoreEvents } from './store';
import { linkTransactionResponse, VC } from '../types/vc';
import { request } from '../shared/request';
import {
  getJwt,
  isCustomSecureKeystore,
} from '../shared/cryptoutil/cryptoUtil';
import {
  getBindingCertificateConstant,
  getPrivateKey,
} from '../shared/keystore/SecureKeystore';
import i18n from '../i18n';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    selectedVc: {} as VC,
    linkCode: '',
    myVcs: [] as string[],
    thumbprint: '',
    linkTransactionResponse: {} as linkTransactionResponse,
    authFactors: [],
    authorizeScopes: null,
    clientName: '',
    configs: {},
    essentialClaims: [],
    linkTransactionId: '',
    logoUrl: '',
    voluntaryClaims: [],
    selectedVoluntaryClaims: [],
    errorMessage: '',
    domainName: '',
    consentClaims: ['name', 'picture'],
    isSharing: {},
    linkedTransactionId: '',
  },
  {
    events: {
      SELECT_VC: (vc: VC) => ({ vc }),
      SCANNING_DONE: (params: string) => ({ params }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      TOGGLE_CONSENT_CLAIM: (enable: boolean, claim: string) => ({
        enable,
        claim,
      }),
      DISMISS: () => ({}),
      CONFIRM: () => ({}),
      GET: (value: string) => ({ value }),
      VERIFY: () => ({}),
      CANCEL: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
    },
  }
);

export const QrLoginEvents = model.events;
export type QrLoginRef = ActorRefFrom<typeof qrLoginMachine>;

export const qrLoginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDocIAbMAYgGUBhAQQDl6BJegcQH0ARAeXoFEA2gAYAuolAAHTLBwAXHJjziQAD0QBGACzqATAQCs+nZv0BmABzqL50zoA0IAJ6IA7KaEFNATnPmv6oUMhHUMAX1CHNCxcQmIyck4mSgBZJMphMSQQKRl5RWU1BF1zFwIvHQrTFxdNCxcANgdnBH16j1NbdT8vfW8q9XDIjGx8AhJ8AGsAFVQAQzxYWYBjPLxyCEUwIjwAN0wJraiRwnG8abmF5dWEfD2l2dWMjOUcuQUlLMKtXQMjEwsrL5bE1EF4XOYCEJ6iEXF4ekIOppzIMQEcYmNJjN5osVu9yGBUKhMKgCBISA8AGbEgC2BDRo1O52xV3eN12mHuj1Ezyyr1WBQ0JQhmlhotMZmM+hcIIQNX0nnUhh65h06hcOhKKPphFgAAtMAB3ADqs1QeHwUHI1F4ADEmAAlZI8yTSN75T6IEIeHT+eo1Lyaeriwwy+pggiwtXw9SKjU6LXDdF6w0ms0Wq0Mah8dDO7Ku-kehBegg+9R+7yB4P6GV+dQRlwBIRqoTqjX1BPRUaUfUGviE4kZ+hZnOiF7594Coo9TSQtyqqUx9zApyINpeCNIoVaYzlUwd45jTCzCDJRwANSWsCoU249r47DvlAACrxKIJR7zx+7QIU-fLofoMaATYWjaKGLjylCOjQi4gSmJoOgNPuSY9jsSzoDgsCyFQ2Z8NQUzsGe1C5nyE6Fr4M4BkI3j6DYtEttWK4tDGEb1H6DbmEYAZschozJgaaEYVh5Bnnw9pMDaACaJFfh8P6uLRZRIoqKl0UI5gyiK9SQtobjUZu0KaLxOqoehmHYYkKRpDJuRkfJRTqRCpj1PoTYBj01QVKGPwVIBHT6AGqq1MZBAUssYC0AArrIurkDatBZoRtDoEwnA2W6cmqJ6rklr6-qVoYjHNP4kI2Jo1ENr01EBiFYVLBF0WxfFiUsGeyWpelBb2cWpbltxVahiKuVqmGXT1IG6heLV4VRTFg7Dp1dlZUWOW9flQaFTW2glrBYK0SqZaqiFtyzOMEBMBAYB4PIsiOAkSSpJQ6Qfi6tnfstf4EABQFdKYoHqKG1EECUrnmEIcJ+FC7YRKiiajCdZ0XVdN13XeUz2pJhFiRJTB0FMTC8It72FD1eUVhtIZMQF2mRjUHT1FYPTQ0MnaEKgYAAI6RXAsjUIosDI1atoOk6L15m9mW-hBX0hD9IGaGBTEIfKvTNoGOhVF4zOw6zBDs1zPN8wsgt0EO2ZE5Lq7S99ql-QrANMe4M6RqNDa6NC5hGTD2oEBseAUJZj3PZkr0ZZOAS+AQzmuZNNGefYSshAYunUdCmvaz7+vc1hFpGwL13rJs2x7AcdJw2znPZ-IeBQHnyNsncDzvE8YukcTq42GUYYtuNgFsQGMqqnWNjwSNiFeACe7e+XeuVzzuf84LBJEiSZKUjSZe61n8813X10NxyTeKC3Ifi2HhYR05LluXHrY1qYO2OanY1sciKJ4Jgl3wFk2pjhLk4AFpGhMQAfKOE4CIGQKnizA8cQwB-3PvZYoEJVT+FVCUaC-hNDeXlDYCoipwRCCIeKEKjIsSXFxO9NulsiguWdpYIMQZoK9F6DKOmX0FYQSITHHoU1p6634qmc0NcEFdWWghNh4MCBlnqGDLQ7EAxvxgeibsho+wr1EUtEmLYIQqmjvbeCKoiqrgCCWTc4JtzeA1qQo8J5zyXk0e3BAIph7jTYvBQIwQLDgWdv4Bo5UkTqjMCFfiglzKOJoX4bS4oGyIR9FUIhCdmgMz0EEqw4pApaGgTrA8dUGoxQiZOGoX0Si1CDFYAKCEkkaChKVUeHQNYNGosdXYp1iBI2unIZoocxGFCRHoKU40VT+H2n4QG8oqig3Bj4LwUIXAhW3lhPeshCmFiROucqhlYK6AXA7Zoxg6wTwgv09JHRfAhT9vAz8-9Cz+HXJUxUCIzBIiRJpaCOkRoNlMGCME8EFlzxzrvRe11Vn2RBtI1oDM-pGAsF4GsdZXJEI8n8Go41wjhCAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./QrLoginMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'QrLogin',
      initial: 'waitingForData',
      states: {
        waitingForData: {
          on: {
            GET: {
              actions: [
                'setScanData',
                'resetLinkTransactionId',
                'resetSelectedVoluntaryClaims',
              ],
              target: 'linkTransaction',
            },
          },
        },
        linkTransaction: {
          invoke: {
            src: 'linkTransaction',
            onDone: [
              {
                actions: [
                  'setlinkTransactionResponse',
                  'expandLinkTransResp',
                  'setClaims',
                ],
                target: 'loadMyVcs',
              },
            ],
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        ShowError: {
          on: {
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        loadMyVcs: {
          entry: 'loadMyVcs',
          on: {
            STORE_RESPONSE: {
              actions: 'setMyVcs',
              target: 'showvcList',
            },
          },
        },
        showvcList: {
          on: {
            SELECT_VC: {
              actions: 'setSelectedVc',
            },
            VERIFY: {
              target: 'faceAuth',
            },
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        faceAuth: {
          on: {
            FACE_VALID: {
              target: 'requestConsent',
            },
            FACE_INVALID: {
              target: 'invalidIdentity',
            },
            CANCEL: {
              target: 'showvcList',
            },
          },
        },
        invalidIdentity: {
          on: {
            DISMISS: {
              target: 'showvcList',
            },
            RETRY_VERIFICATION: {
              target: 'faceAuth',
            },
          },
        },
        sendingAuthenticate: {
          invoke: {
            src: 'sendAuthenticate',
            onDone: {
              target: 'requestConsent',
              actions: 'setLinkedTransactionId',
            },
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        requestConsent: {
          on: {
            CONFIRM: {
              target: 'loadingThumbprint',
            },
            TOGGLE_CONSENT_CLAIM: {
              actions: 'setConsentClaims',
              target: 'requestConsent',
            },
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        loadingThumbprint: {
          entry: 'loadThumbprint',
          on: {
            STORE_RESPONSE: {
              actions: 'setThumbprint',
              target: 'sendingConsent',
            },
          },
        },
        sendingConsent: {
          invoke: {
            src: 'sendConsent',
            onDone: {
              target: 'success',
            },
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        success: {
          on: {
            CONFIRM: {
              target: 'done',
            },
          },
        },
        done: {
          type: 'final',
          data: (context) => context,
        },
      },
    },
    {
      actions: {
        forwardToParent: sendParent('DISMISS'),

        setScanData: assign({
          linkCode: (context, event) => event.value,
        }),

        loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
          to: (context) => context.serviceRefs.store,
        }),

        setMyVcs: model.assign({
          myVcs: (_context, event) => (event.response || []) as string[],
        }),

        loadThumbprint: send(
          (context) =>
            StoreEvents.GET(
              getBindingCertificateConstant(
                context.selectedVc.walletBindingResponse?.walletBindingId
              )
            ),
          { to: (context) => context.serviceRefs.store }
        ),
        setThumbprint: assign({
          thumbprint: (_context, event) => {
            return (event.response || '') as string;
          },
        }),
        resetLinkTransactionId: model.assign({
          linkTransactionId: () => '',
        }),

        resetSelectedVoluntaryClaims: model.assign({
          selectedVoluntaryClaims: () => [],
        }),

        setSelectedVc: assign({
          selectedVc: (context, event) => {
            return { ...event.vc };
          },
        }),

        setlinkTransactionResponse: assign({
          linkTransactionResponse: (context, event) =>
            event.data as linkTransactionResponse,
        }),

        expandLinkTransResp: assign({
          authFactors: (context) => context.linkTransactionResponse.authFactors,

          authorizeScopes: (context) =>
            context.linkTransactionResponse.authorizeScopes,

          clientName: (context) => context.linkTransactionResponse.clientName,

          configs: (context) => context.linkTransactionResponse.configs,

          essentialClaims: (context) =>
            context.linkTransactionResponse.essentialClaims,

          linkTransactionId: (context) =>
            context.linkTransactionResponse.linkTransactionId,

          logoUrl: (context) => context.linkTransactionResponse.logoUrl,

          voluntaryClaims: (context) =>
            context.linkTransactionResponse.voluntaryClaims,
        }),

        setClaims: (context) => {
          context.voluntaryClaims.map((claim) => {
            context.isSharing[claim] = false;
          });
        },

        SetErrorMessage: assign({
          errorMessage: (context, event) =>
            i18n.t(`errors.genericError`, {
              ns: 'common',
            }),
        }),

        setConsentClaims: assign({
          isSharing: (context, event) => {
            context.isSharing[event.claim] = !event.enable;
            if (!event.enable) {
              context.selectedVoluntaryClaims.push(event.claim);
            } else {
              context.selectedVoluntaryClaims =
                context.selectedVoluntaryClaims.filter(
                  (eachClaim) => eachClaim !== event.claim
                );
            }
            return { ...context.isSharing };
          },
        }),
        setLinkedTransactionId: assign({
          linkedTransactionId: (context, event) => event.data as string,
        }),
      },
      services: {
        linkTransaction: async (context) => {
          const response = await request(
            'POST',
            '/v1/esignet/linked-authorization/link-transaction',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                linkCode: context.linkCode,
              },
            },
            ESIGNET_BASE_URL
          );
          return response.response;
        },

        sendAuthenticate: async (context) => {
          let privateKey;

          if (!isCustomSecureKeystore()) {
            privateKey = await getPrivateKey(
              context.selectedVc.walletBindingResponse?.walletBindingId
            );
          }

          var walletBindingResponse = context.selectedVc.walletBindingResponse;
          var jwt = await getJwt(
            privateKey,
            context.selectedVc.id,
            context.thumbprint
          );

          const response = await request(
            'POST',
            '/v1/esignet/linked-authorization/authenticate',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                linkedTransactionId: context.linkTransactionId,
                individualId: context.selectedVc.id,
                challengeList: [
                  {
                    authFactorType: 'WLA',
                    challenge: jwt,
                    format: 'jwt',
                  },
                ],
              },
            },
            ESIGNET_BASE_URL
          );
          return response.response.linkedTransactionId;
        },

        sendConsent: async (context) => {
          let privateKey;
          if (!isCustomSecureKeystore()) {
            privateKey = await getPrivateKey(
              context.selectedVc.walletBindingResponse?.walletBindingId
            );
          }

          const jwt = await getJwt(
            privateKey,
            context.selectedVc.id,
            context.thumbprint
          );

          const response = await request(
            'POST',
            '/v1/esignet/linked-authorization/authenticate',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                linkedTransactionId: context.linkTransactionId,
                individualId: context.selectedVc.id,
                challengeList: [
                  {
                    authFactorType: 'WLA',
                    challenge: jwt,
                    format: 'jwt',
                  },
                ],
              },
            },
            ESIGNET_BASE_URL
          );
          var linkedTrnId = response.response.linkedTransactionId;

          const resp = await request(
            'POST',
            '/v1/esignet/linked-authorization/consent',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                linkedTransactionId: linkedTrnId,
                acceptedClaims: context.essentialClaims.concat(
                  context.selectedVoluntaryClaims
                ),
                permittedAuthorizeScopes: context.authorizeScopes,
              },
            },
            ESIGNET_BASE_URL
          );
          console.log(resp.response.linkedTransactionId);
        },
      },
    }
  );

export function createQrLoginMachine(serviceRefs: AppServices) {
  return qrLoginMachine.withContext({
    ...qrLoginMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof qrLoginMachine>;

export function selectMyVcs(state: State) {
  return state.context.myVcs;
}
export function selectIsWaitingForData(state: State) {
  return state.matches('waitingForData');
}

export function selectDomainName(state: State) {
  return state.context.domainName;
}

export function selectIsLinkTransaction(state: State) {
  return state.matches('linkTransaction');
}

export function selectIsloadMyVcs(state: State) {
  return state.matches('loadMyVcs');
}

export function selectIsShowingVcList(state: State) {
  return state.matches('showvcList');
}

export function selectIsisVerifyingIdentity(state: State) {
  return state.matches('faceAuth');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('invalidIdentity');
}

export function selectIsShowError(state: State) {
  return state.matches('ShowError');
}

export function selectIsRequestConsent(state: State) {
  return state.matches('requestConsent');
}
export function selectIsSendingAuthenticate(state: State) {
  return state.matches('sendingAuthenticate');
}

export function selectIsSendingConsent(state: State) {
  return state.matches('sendingConsent');
}

export function selectIsVerifyingSuccesful(state: State) {
  return state.matches('success');
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectLinkTransactionResponse(state: State) {
  return state.context.linkTransactionResponse;
}
export function selectEssentialClaims(state: State) {
  return state.context.essentialClaims;
}

export function selectVoluntaryClaims(state: State) {
  return state.context.voluntaryClaims;
}

export function selectLogoUrl(state: State) {
  return state.context.logoUrl;
}

export function selectClientName(state: State) {
  return state.context.clientName;
}

export function selectErrorMessage(state: State) {
  return state.context.errorMessage;
}
export function selectIsSharing(state: State) {
  return state.context.isSharing;
}
