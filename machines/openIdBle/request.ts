import SmartshareReactNative from '@idpass/smartshare-react-native';
import OpenIdBle from 'react-native-openid4vp-ble';
import uuid from 'react-native-uuid';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  EmitterSubscription,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { StoreEvents } from '../store';
import { VC } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import {
  GNM_API_KEY,
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../shared/constants';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import { VcEvents } from '../vc';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import {
  ExchangeReceiverInfoEvent,
  onlineSubscribe,
  offlineSubscribe,
  PairingResponseEvent,
  onlineSend,
  offlineSend,
  SendVcResponseEvent,
} from '../../shared/openIdBLE/smartshare';
import { log } from 'xstate/lib/actions';
// import { verifyPresentation } from '../shared/vcjs/verifyPresentation';

const { GoogleNearbyMessages } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;
type SharingProtocol = 'OFFLINE' | 'ONLINE';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVc: {} as VC,
    storeError: null as Error,
    connectionParams: '',
    loggers: [] as EmitterSubscription[],
    sharingProtocol: (Platform.OS === 'ios'
      ? 'ONLINE'
      : 'OFFLINE') as SharingProtocol,
    receiveLogType: '' as ActivityLogType,
  },
  {
    events: {
      ACCEPT: () => ({}),
      ACCEPT_AND_VERIFY: () => ({}),
      GO_TO_RECEIVED_VC_TAB: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      RESET: () => ({}),
      DISMISS: () => ({}),
      VC_RECEIVED: (vc: VC) => ({ vc }),
      CONNECTION_DESTROYED: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      BLE_ERROR: () => ({}),
      EXCHANGE_DONE: (senderInfo: DeviceInfo) => ({ senderInfo }),
      SCREEN_FOCUS: () => ({}),
      SCREEN_BLUR: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      NEARBY_ENABLED: () => ({}),
      NEARBY_DISABLED: () => ({}),
      STORE_READY: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      RECEIVED_VCS_UPDATED: () => ({}),
      VC_RESPONSE: (response: unknown) => ({ response }),
      SWITCH_PROTOCOL: (value: boolean) => ({ value }),
      GOTO_SETTINGS: () => ({}),
      APP_ACTIVE: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
    },
  }
);

export const RequestEvents = model.events;

export const requestMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiACwAmADQgAnogCMADlYyAdBrms5MgGynjAZlYbzAXxtLUmHARLlqAMQDyhBvjackED5BYTEJaQR5JVUEOQBWIx04gE41OVTrAHZtYzsHdCxYPHwAdQBJABVCAAkqAAViTwrvTzp-CWChEXFAiKiVRHjMuJ1WOJkNTONkzMzklLyQR0K8elIqUmJGlg4O-i6w3tlFAdiNGV1MmWG1C9Y1NXN9ReXnMnxSCvbAztCe0D6JxiRiuOjSs1YpmSxketnsSwKOB0AGMABZgZEAawoYAAhsgAEbKOpgZAAWwEsEEYhR6KxAlEUFwFFIAEFiDQAJobCistYAEW+PH2f3C6lYMySJnOGmsyXMCWig2mcil2WsKTkjzGL0RRVpGOxeMJxNJFKp3QN9MZzLZHO5-LK+D5dFIgt2PxF3TFCDiph0sw0xjimi1cmMMmSSti42SejUyTk6TUKWShjiuqc+rRhpx+KJJPJlOpoh0ryKDKZLPZXJ5LrdQqCXsOAPFkvGxhlcoVQMGft0kM010s5hmU0zKytRvzpqLFpp5eENur9qojudAsbv29RwQaglmSlnYm3cVpzkTzUOnMcnOD3lCSsMgnSJz1qgNAANlhsLxeNhUXwUkADcBGRMAp0rXB6AYT5PCaWpKHrd0AmFEId1bPdjEMME-TkWYLFSC5MmjfDrlGNQrkyG9A0hZ94UXSDGS-H8-wAoDkFA8CmKZGC4IQtcnWQrdm3+KR1Gw1UU2MfCplHW5rlI7DdFvaFNHOOI4kyc4X2zOlMUrFiwF-f9AJAsCIMXKC+OaASkM3D00IOMSIgMKZRkjOJzFuVgrhkJTNCSG9vOSWVDGsXTsB4oyTPY8zuKsm0bPgipanXYTHKbdCW3E2IZE00ZzCecMNDwhVSMjQ8tDGfDLFC-DIui79jLYszOIsnQwFEXECU-SBcBE7KXMGfKRlYIr9E7Mq4lIq4r1qtJzAuOJzkhRretY0z+S6gR+oAcSaTwqA+CoKjKCg9r8TLtxyvoivMHRw1vJbzEyRbzAq7QdGHLVZU0YN5ka0RjRoWdzRLbbRF2iBcAO5pjs+M6Lqu1Csucn1KNHa8Hk0YZZjDKNz1vDRRnufCLy8owNEa5E+vxStCDEYHkT+XBCE8CgWUIM6ObXUh8AqRpOQba7RJ9Jb8p0Y9xj9YxsgmWbHm+i8THyh8g0yGm6eQBmmYxVnJCKXFsAg3EADMTeQAAKfl+cFzxuTOgBZUhPAYCoAEpcEY2njV10Rmb+Qb0d3CWRml-LTHljRZosPRJm0GYJeSGZGoAd1xLpGXcXhkEZgP9e6NmOa5ioRdRm7hoQcxpj0AjHn0a5MnDGbTle7zrwjZv7gTDQ1HTzOlygHO871lmi-XdnOdIbng9FUPa8mKYG5BZvg2jGRWAla8ZAeEM-M0ZJGu4VBuHpxkKl4UhJDRXFGTAMpRDN3hcDIQhSDKAA1dZbc-sp36oOdLwc8MK5VmIeZuqQtK7yejID6bd1RJGDBebQr0ZSNTADfVEd8oCVm2lxB+T8X6kAABo1FZBdH+HNSAgNuuoXse45AYKwTgvBYACGP2frgSeJcZ5fFFkNDGmkIHJHkH6NMag5YkQQZGPQXcDD3j7sw2+jI2EcKIToBkdRkC8CgKgKkuBDbYGNqbC2pIrZT1LmUXmztXbuy9oxTBKjcGMnwRZThvBNGiG0bo-RsBaFVweNkKWCZZgjniE8aMr1N5yLCktAw41AYMT1FFJx2DVGuPYe4jRwgyRgF4BgPAhAKHvzaAIkOmEUxaQDKI+I0x7hSKidMOMm8HhLRmLKUKA8s7D1zp-ZE3CnSWL4QEn0+gom3ivLUmYcQt7eRrnCfIWYooZx6SPfpuBP6ECoG-D+38UJ7EEbuFaIw5L3EMJIvu8pSJ+h0PKYKMJxgoNuN0oe6zkReJ8XouAsBDFGxNjoc2lsrb4GqOyc6e0qC2Ldp7b2KSdCrLeX0j5WidHfKpKM3cv0AxaT7kYJ4cst4MISZceQjxpgXFCoshEyyEWD0rO8nQuT8mFLZiU0gZSK5i13ImKJkj5oPAlPMeQYxKI0zvuBT8n4oKYsws3KJszdCUSDONNI8pJjUsYqgUCYA05QVZIQd+dR+FcqOXKvudygwzH3ONZMDDN6sG+hGJuVwipanoksyc2rdp6ptAao1FQqAUP5FQb+xAyjuE5LKsBFrQrTDenMu10Z9COq3o8Ne2kprU2SbS71uqoJkAAFIjPKfPc1UyrUJttakBh+5JHfTgUmBMMJ1WNTzb6pkxSKClOjREbSFb402pvDW6M0IRgzGhLMCYcCEgeppV6rJ+bGQ6GAqSAQZtlCVjKBALqwhsDKFwO4A16xP6sjoGUA5nozW5VuOcb6Vqx3pHSHLaMphLj4VmRKTSYx7htsXR2lda6N1bp3aIPdB6j0APOqe89l6nJltyvMB6K1SrRJ+uNaMKRdBqwWuquBf6dUAdXTrYDjJt27qEAertPbS2gIiLe7DD7kGJkndGKYjq5hb0MGmCUSYmE5oXYRysXjgK4mlRAcjYHKODPwE7J0KNDkVMQ15JIsovJ+WogYeBMRxgPRTlpW8b0ZLQIIz64TDJRPick+B1+nxiDcjDRG-+rIeYUF7YgURyG1Noc0xh04zTHrTGwgqOWd5+OeqRO24TxH12bsZJ-bguAIBiAghZ3gmJLLwqi8umLpGoAJYQGl5Extuj+Hc3ueJ8dxhwP3MvbyyaHiPS8uMai2lZnaVM0uqAgGSNxfy4l0kOjkA6G4J+Y2z9yRliy-+6LQG+sFaKyVsQZXaN0Iq-IKrFxvK+RhPV04pUSbZETNpN6aDNYCcizN5duJkTgW4EPAgzQyAbC2J4HYpqlMRH0AO61iaR2nBTBeAM+gEiiJORKTrAGbt3aHlN5ZlZiAYjAAIVdEB+m-K2Ts-mdQOYfHKwo5D+5vJ70uaVV9+FvohhMPuTeN5NKQ+E9DsA93hOJSgIj8CKPIDo82ds94OOKB47UB9hDrl7iE9VSTzsZPTgJCmfMZukxJFDDnVqq73Wmcs+XWz6+lIh4bIFm99Y-Pcc0NW1XIYqaDtNojPobTiAZKHnyrcGE2hbX04u-qbLGvbvM9h3k5ALioCP2RLwCk8WBmG+eybwXZuRd0cQFoH7Vbh1pGjJjOMKQ5Y1wsDeXyGZPdRW94C33Wvusn2Z11CACOkdc7R5Hp7xvsem-x1pK3K0bcTAvJhrUdyFeGeVyZwvU2hPXdL7DooudKwG8b1j-AAu8fm7GY1uNv3q1p4B52B6o0ImrVp+diLXv1cl5h-1dccn8AKavZ99QlhdARm8jKIcUx0-UUOxYLb0I8+PAZ2P0-MMDooUjpdkv43RQ1tkKg+RyttR78asn9zgX9N871iZHcsg6IC9D8i9j9UAAArfWM-J0C-K-eDBPaufcYwb6UcUqFacaNBdPDQeUR6YqBMeQbCfcbNTAkfMzZdWAXEUCbOTOPqGGc-eTaAi5KWadLUOYTzSJAHTSOMKwAwFILQV6UKDA+dS7UfbrXg-g4eQQ-aI6eGEA-ZcAqFKApfXcbUEYcYSRe4AibCYwdParUYFNZQ8aOYUqRqavWAUPAuFmAg2TUQiwzCVQuuOrRufGdeNuWUEmbCB8VIVrG8RqdJCAaVZiPqUgZAIbGTIg8rGuXQFIB4OBPFTGYYUic4UlG4O4NpZ4RYUQXgHdeAQIRcRTUXRAAAWhrmjHaLSFVGWmJlemDCDAsEagZBu2EFXVaNIK1CvCzwVATFeluGolbhiGVSvEbiHUjHuQ4I0L0lzGNALDNGLFAUrh9AvBJnzwSA70gTgWkWBDgTjAlm0GUPiDHRpn0jzBNELHBktDfAMkZCmLW1vAoMuPiH0BuNehuV3lGGDGyHiBDFxVV3hT+M+MOLnBLDhxWErEBKrlmCvEDAsGUKmHDEcPPASAoLtyfE3mGEMHeMNEMmalijagIRxIxlvEdSTFHCKnynOL9AqkYL7md2oIYK3nUJ9n0gZM2jinam4j+OxOvzaIq1vEegvHuR5KeD5PPCOwDBO3lHwgTAWGHzlPSKlOZI6jZ1ZMsOsBJkUTehWiOzGBuQtXSAVHEWtLojpPfBilag4gIU6m6l6kgEtMwhQUPHqTSDbzxLgVmhiTqQTFqhMCPmHw2hai2h2iDIVNIO8nckonVQIhqzUBuTGCClxTdXaVMCBhBjBmOLEEhmhmDJvUsFVA7GsEsDGFO1JOBCeAUIsCjlEVlDmCRNpV9nPigHzkDhOO5RCIvCvBvBJPSGKOWkVgoLCVuHmSmF3jFPhURQZVznHMLhylON3BfTbjTBGHiBMFa0ohuGPlPlHMvmvmcUIWfgbIiASEPFCnmFSBTEsFMCiUQRrlKjf3GhnS3NpTSVYUyXURfMzLWxTkdSDF7j9EonylHCaWLM3gjBmFCzp2UXSSDzcXAg8U+TRT8VfPFCeDkSQphCuHGH-KxlKlxgWQ-yHMnAgoySgEIufM8WZQKWwHIr3BgTuSKL9HfIBhjgQQYpDA1V7IlleV3OQH6QErQoBytUemkNxgQN-WHx3OzmRRIt8R+QEsmFIjmQDHiDcn5UMwP12JWXpT0sUo+V4sKQErgQQqTyTm2wlELPPDMubkfCMzSCXnFVEElTSKgAEpQsdSGKDGKlxXDCiWuDjFCy8hTksH7F-witgtxKKktUHT+w3xiG8lVDUO8hFQMFWlyGH2LwEFSLAEirmiSAMw1FSHmHiDY07CSAssjC3lqQamquP1yz62s0o0iqUPjkMHdVB1EUJhiFCx1IVF8nSFitlEypEzE1qpGv3QEv7TyrX1TwYU0hGFdPIIVGom8jWqGun24EitsLBCeGeKeFHDmGTS3j7xorBOomwrWs1yHgaqVmEWekKLapWNkEa0fGuByAnU0B+vH1ZxSRr051R3RwaphCasVwVFaquMwyViMCTGUi-y3lYs0O4J9xh3hvh0ZF1wrAjwEovESE3jiVEUB00lfS+lGhrm0ngrenC1sq4K6xPz92EwDyDxDzD2n2RDpqmEz1mDaueprTuId3Zs0k5oYLTB5thvJuXQr24Cr0RuR2RsluyrOLzyapMASGHVnXt0iFCj7y-1aX3GTE1qFp4N-B1lpuNqxWkLBA1RyDTWmA3ltpTntp7m437gGq0MFvuwzJILWzrSvCSobjxOGBmHTywqlE0l7M0DGE7DWtwPwIgAErTBXNFP+isB7kVoQFEQ4yKgUgSOuE8IjtJp0G6lAigBKwvl4GqDD3qs9sqT9EdXTTTGqlQIktWNMHmkTAmEB0hCTM4OLx0IZX0MLr7sQ2ogkPOCkJTjgVkNWLKrBE7Hz0TDfWDDWsXoEIECEM0TqsisSQDChBTHCmuBMCcLes1C8hd16qeDPr4KXsvsgBXVJqUtXvoxdyCl6IYKoJTjHvUHkKQTTGuFSvz15sYm8N8MDhjrRkVMxmipQwsBB20gSuiOQOHFKmZs8uSLvlSIZLAEyKG0ioYKdV41lllCMAjHKMlhVlmS1HyJTHojsCAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./request.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
        services: {} as {
          verifyVp: {
            data: VC;
          };
        },
      },
      invoke: {
        src: 'monitorConnection',
      },
      id: 'request',
      initial: 'inactive',
      on: {
        SCREEN_BLUR: {
          target: '.inactive',
        },
        SCREEN_FOCUS: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          target: '.checkNearbyDevicesPermission',
        },
        SWITCH_PROTOCOL: {
          target: '.checkNearbyDevicesPermission',
          actions: 'switchProtocol',
        },
        BLE_ERROR: {
          target: '.handlingBleError',
        },
        RESET: {
          target: '.checkNearbyDevicesPermission',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },
        checkNearbyDevicesPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: '#request.checkingBluetoothService',
                },
                NEARBY_DISABLED: {
                  target: 'requesting',
                },
              },
            },
            requesting: {
              invoke: {
                src: 'requestNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: '#request.checkingBluetoothService',
                },
                NEARBY_DISABLED: {
                  target: '#request.nearByDevicesPermissionDenied',
                },
              },
            },
          },
        },

        checkingBluetoothService: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothService',
              },
              on: {
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: {
                  target: 'requesting',
                },
              },
            },
            requesting: {
              invoke: {
                src: 'requestBluetooth',
              },
              on: {
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: {
                  target: '#request.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                target: '#request.clearingConnection',
              },
            },
          },
        },
        bluetoothDenied: {},
        nearByDevicesPermissionDenied: {
          on: {
            APP_ACTIVE: '#request.checkNearbyDevicesPermission',
            GOTO_SETTINGS: {
              actions: 'openAppPermission',
            },
          },
        },
        clearingConnection: {
          invoke: {
            src: 'disconnect',
          },
          on: {
            CONNECTION_DESTROYED: {
              target: '#request.waitingForConnection',
              actions: [],
              internal: false,
            },
          },
          after: {
            DESTROY_TIMEOUT: {
              target: '#request.waitingForConnection',
              actions: [],
              internal: false,
            },
          },
        },
        waitingForConnection: {
          entry: [
            'removeLoggers',
            'registerLoggers',
            'generateConnectionParams',
          ],
          invoke: {
            src: 'advertiseDevice',
          },
          on: {
            CONNECTED: {
              target: 'preparingToExchangeInfo',
            },
            DISCONNECT: {
              target: 'disconnected',
            },
          },
        },
        preparingToExchangeInfo: {
          entry: 'requestReceiverInfo',
          on: {
            RECEIVE_DEVICE_INFO: {
              target: 'exchangingDeviceInfo',
              actions: 'setReceiverInfo',
            },
          },
        },
        exchangingDeviceInfo: {
          invoke: {
            src: 'exchangeDeviceInfo',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                CONNECTION_TIMEOUT: {
                  target: '#request.exchangingDeviceInfo.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#request.cancelling',
                },
              },
            },
          },
          on: {
            EXCHANGE_DONE: {
              target: 'waitingForVc',
              actions: 'setSenderInfo',
            },

            DISCONNECT: {
              target: 'disconnected',
            },
          },
        },
        waitingForVc: {
          invoke: {
            src: 'receiveVc',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                SHARING_TIMEOUT: {
                  target: '#request.waitingForVc.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#request.cancelling',
                },
              },
            },
          },
          on: {
            DISCONNECT: {
              target: 'disconnected',
            },
            VC_RECEIVED: {
              target: 'reviewing.accepting',
              actions: 'setIncomingVc',
            },
          },
        },
        cancelling: {
          invoke: {
            src: 'sendDisconnect',
          },
          always: {
            target: '#request.clearingConnection',
          },
        },
        reviewing: {
          initial: 'idle',
          states: {
            idle: {},
            verifyingIdentity: {
              exit: 'clearShouldVerifyPresence',
              on: {
                FACE_VALID: {
                  target: 'accepting',
                  actions: 'setReceiveLogTypeVerified',
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
                  actions: 'setReceiveLogTypeUnverified',
                },
                CANCEL: {
                  target: 'idle',
                },
              },
            },
            invalidIdentity: {
              on: {
                DISMISS: {
                  target: 'accepting',
                },
                RETRY_VERIFICATION: {
                  target: 'verifyingIdentity',
                },
              },
            },
            verifyingVp: {
              invoke: {
                src: 'verifyVp',
                onDone: [
                  {
                    target: 'accepting',
                  },
                ],
                onError: [
                  {
                    target: 'idle',
                    actions: log('Failed to verify Verifiable Presentation'),
                  },
                ],
              },
            },
            accepting: {
              initial: 'requestingReceivedVcs',
              states: {
                requestingReceivedVcs: {
                  entry: 'requestReceivedVcs',
                  on: {
                    VC_RESPONSE: [
                      {
                        target: 'requestingExistingVc',
                        cond: 'hasExistingVc',
                      },
                      {
                        target: 'prependingReceivedVc',
                      },
                    ],
                  },
                },
                requestingExistingVc: {
                  entry: 'requestExistingVc',
                  on: {
                    STORE_RESPONSE: {
                      target: 'mergingIncomingVc',
                    },
                  },
                },
                mergingIncomingVc: {
                  entry: 'mergeIncomingVc',
                  on: {
                    STORE_RESPONSE: {
                      target: '#request.reviewing.accepted',
                    },
                  },
                },
                prependingReceivedVc: {
                  entry: 'prependReceivedVc',
                  on: {
                    STORE_RESPONSE: {
                      target: 'storingVc',
                    },
                  },
                },
                storingVc: {
                  entry: 'storeVc',
                  on: {
                    STORE_RESPONSE: {
                      target: '#request.reviewing.accepted',
                    },
                  },
                },
              },
              on: {
                STORE_ERROR: {
                  actions: 'setStoringError',
                  target: '#request.reviewing.savingFailed',
                },
              },
            },
            accepted: {
              entry: [
                'sendVcReceived',
                'setReceiveLogTypeRegular',
                'logReceived',
              ],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: 'ACCEPTED',
                },
              },
              on: {
                DISMISS: {
                  target: 'navigatingToHome',
                },
                GO_TO_RECEIVED_VC_TAB: {
                  target: 'navigatingToHome',
                },
              },
            },
            rejected: {
              entry: ['setReceiveLogTypeDiscarded', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: 'REJECTED',
                },
              },
              on: {
                DISMISS: {
                  target: '#request.clearingConnection',
                },
              },
            },
            navigatingToHome: {
              invoke: {
                src: 'disconnect',
              },
            },
            savingFailed: {
              initial: 'idle',
              entry: ['setReceiveLogTypeDiscarded', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: 'REJECTED',
                },
              },
              states: {
                idle: {},
                viewingVc: {},
              },
              on: {
                DISMISS: {
                  target: '.viewingVc',
                },
                GO_TO_RECEIVED_VC_TAB: {
                  target: 'navigatingToHome',
                },
              },
            },
          },
          on: {
            ACCEPT: {
              target: '.accepting',
              actions: 'setReceiveLogTypeRegular',
            },
            ACCEPT_AND_VERIFY: {
              target: '.verifyingIdentity',
            },
            REJECT: {
              target: '.rejected',
            },
            CANCEL: {
              target: '.rejected',
            },
          },
        },
        disconnected: {
          on: {
            DISMISS: {
              target: 'waitingForConnection',
            },
          },
        },
        handlingBleError: {
          on: {
            DISMISS: {
              target: '#request.clearingConnection',
            },
          },
        },
      },
    },
    {
      actions: {
        openAppPermission: () => {
          Linking.openSettings();
        },

        switchProtocol: assign({
          sharingProtocol: (_context, event) =>
            event.value ? 'ONLINE' : 'OFFLINE',
        }),

        requestReceivedVcs: send(VcEvents.GET_RECEIVED_VCS(), {
          to: (context) => context.serviceRefs.vc,
        }),

        requestReceiverInfo: sendParent('REQUEST_DEVICE_INFO'),

        setReceiverInfo: model.assign({
          receiverInfo: (_context, event) => event.info,
        }),

        generateConnectionParams: assign({
          connectionParams: (context) => {
            if (context.sharingProtocol === 'OFFLINE') {
              return Openid4vpBle.getConnectionParameters();
            } else {
              const cid = uuid.v4();
              return JSON.stringify({
                pk: '',
                cid,
              });
            }
          },
        }),

        setSenderInfo: model.assign({
          senderInfo: (_context, event) => event.senderInfo,
        }),

        setIncomingVc: assign({
          incomingVc: (_context, event) => {
            const vp = event.vc.verifiablePresentation;
            return vp != null
              ? {
                  ...event.vc,
                  verifiableCredential: vp.verifiableCredential[0],
                }
              : event.vc;
          },
        }),

        setStoringError: assign({
          storeError: (_context, event) => event.error,
        }),

        registerLoggers: assign({
          loggers: () => {
            if (__DEV__) {
              return [
                Openid4vpBle.handleNearbyEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Receiver.Event>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
                Openid4vpBle.handleLogEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Receiver.Log>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
              ];
            } else {
              return [];
            }
          },
        }),

        removeLoggers: assign({
          loggers: ({ loggers }) => {
            loggers?.forEach((logger) => logger.remove());
            return null;
          },
        }),

        prependReceivedVc: send(
          (context) =>
            StoreEvents.PREPEND(
              RECEIVED_VCS_STORE_KEY,
              VC_ITEM_STORE_KEY(context.incomingVc)
            ),
          { to: (context) => context.serviceRefs.store }
        ),

        requestExistingVc: send(
          (context) => StoreEvents.GET(VC_ITEM_STORE_KEY(context.incomingVc)),
          { to: (context) => context.serviceRefs.store }
        ),

        mergeIncomingVc: send(
          (context, event) => {
            const existing = event.response as VC;
            const updated: VC = {
              ...existing,
              reason: existing.reason.concat(context.incomingVc.reason),
            };
            return StoreEvents.SET(VC_ITEM_STORE_KEY(updated), updated);
          },
          { to: (context) => context.serviceRefs.store }
        ),

        storeVc: send(
          (context) =>
            StoreEvents.SET(
              VC_ITEM_STORE_KEY(context.incomingVc),
              context.incomingVc
            ),
          { to: (context) => context.serviceRefs.store }
        ),

        setReceiveLogTypeRegular: model.assign({
          receiveLogType: 'VC_RECEIVED',
        }),

        setReceiveLogTypeVerified: model.assign({
          receiveLogType: 'VC_RECEIVED_WITH_PRESENCE_VERIFIED',
        }),

        setReceiveLogTypeUnverified: model.assign({
          receiveLogType: 'VC_RECEIVED_BUT_PRESENCE_VERIFICATION_FAILED',
        }),

        setReceiveLogTypeDiscarded: model.assign({
          receiveLogType: 'VC_RECEIVED_NOT_SAVED',
        }),

        logReceived: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.incomingVc),
              type: context.receiveLogType,
              timestamp: Date.now(),
              deviceName:
                context.senderInfo.name || context.senderInfo.deviceName,
              vcLabel: context.incomingVc.tag || context.incomingVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        sendVcReceived: send(
          (context) => {
            return VcEvents.VC_RECEIVED(VC_ITEM_STORE_KEY(context.incomingVc));
          },
          { to: (context) => context.serviceRefs.vc }
        ),

        clearShouldVerifyPresence: assign({
          incomingVc: (context) => ({
            ...context.incomingVc,
            shouldVerifyPresence: false,
          }),
        }),
      },

      services: {
        sendDisconnect: (context) => () => {
          if (context.sharingProtocol === 'ONLINE') {
            onlineSend({
              type: 'disconnect',
              data: 'rejected',
            });
          }
        },

        disconnect: (context) => (callback) => {
          try {
            if (context.sharingProtocol === 'OFFLINE') {
              Openid4vpBle.destroyConnection(() => {
                callback({ type: 'CONNECTION_DESTROYED' });
              });
            } else {
              GoogleNearbyMessages.disconnect();
            }
          } catch (e) {
            // pass
          }
        },

        checkBluetoothService: () => (callback) => {
          const subscription = BluetoothStateManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
              callback(model.events.BLUETOOTH_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_DISABLED());
            }
          }, true);
          return () => subscription.remove();
        },

        requestBluetooth: () => (callback) => {
          BluetoothStateManager.requestToEnable()
            .then(() => callback(model.events.BLUETOOTH_ENABLED()))
            .catch(() => callback(model.events.BLUETOOTH_DISABLED()));
        },

        requestNearByDevicesPermission: () => (callback) => {
          requestMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          ])
            .then((response) => {
              if (
                response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
                  RESULTS.GRANTED &&
                response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                  RESULTS.GRANTED
              ) {
                callback(model.events.NEARBY_ENABLED());
              } else {
                callback(model.events.NEARBY_DISABLED());
              }
            })
            .catch((err) => {
              callback(model.events.NEARBY_DISABLED());
            });
        },

        checkNearByDevicesPermission: () => (callback) => {
          if (Platform.OS === 'android' && Platform.Version >= 31) {
            const result = checkMultiple([
              PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
              PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            ])
              .then((response) => {
                if (
                  response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
                    RESULTS.GRANTED &&
                  response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                    RESULTS.GRANTED
                ) {
                  callback(model.events.NEARBY_ENABLED());
                } else {
                  callback(model.events.NEARBY_DISABLED());
                }
              })
              .catch((err) => {
                callback(model.events.NEARBY_DISABLED());
              });
          } else {
            callback(model.events.NEARBY_ENABLED());
          }
        },
        advertiseDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            Openid4vpBle.createConnection('advertiser', () => {
              callback({ type: 'CONNECTED' });
            });
          } else {
            (async function () {
              GoogleNearbyMessages.addOnErrorListener((kind, message) =>
                console.log('\n\n[request] GNM_ERROR\n\n', kind, message)
              );

              await GoogleNearbyMessages.connect({
                apiKey: GNM_API_KEY,
                discoveryMediums: ['ble'],
                discoveryModes: ['scan', 'broadcast'],
              });
              console.log('[request] GNM connected!');

              await onlineSubscribe('pairing', async (scannedQrParams) => {
                try {
                  const generatedParams = JSON.parse(
                    context.connectionParams
                  ) as ConnectionParams;
                  if (scannedQrParams.cid === generatedParams.cid) {
                    const event: PairingResponseEvent = {
                      type: 'pairing:response',
                      data: 'ok',
                    };
                    await onlineSend(event);
                    callback({ type: 'CONNECTED' });
                  }
                } catch (e) {
                  console.error('Could not parse message.', e);
                }
              });
            })();
          }
        },

        monitorConnection: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = Openid4vpBle.handleNearbyEvents((event) => {
              if (event.type === 'onDisconnected') {
                callback({ type: 'DISCONNECT' });
              }

              if (event.type === 'onError') {
                callback({ type: 'BLE_ERROR' });
                console.log('BLE Exception: ' + event.message);
              }
            });

            return () => subscription.remove();
          }
        },

        exchangeDeviceInfo: (context) => (callback) => {
          const event: ExchangeReceiverInfoEvent = {
            type: 'exchange-receiver-info',
            data: context.receiverInfo,
          };

          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = offlineSubscribe(
              'exchange-sender-info',
              (senderInfo) => {
                offlineSend(event, () => {
                  callback({ type: 'EXCHANGE_DONE', senderInfo });
                });
              }
            );

            return () => subscription.remove();
          } else {
            onlineSubscribe('exchange-sender-info', async (senderInfo) => {
              await GoogleNearbyMessages.unpublish();
              await onlineSend(event);
              callback({ type: 'EXCHANGE_DONE', senderInfo });
            });
          }
        },

        receiveVc: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = offlineSubscribe('send-vc', ({ vc }) => {
              callback({ type: 'VC_RECEIVED', vc });
            });

            return () => subscription.remove();
          } else {
            let rawData = '';
            onlineSubscribe(
              'send-vc',
              async ({ isChunked, vc, vcChunk }) => {
                await GoogleNearbyMessages.unpublish();
                if (isChunked) {
                  rawData += vcChunk.rawData;
                  if (vcChunk.chunk === vcChunk.total - 1) {
                    const vc = JSON.parse(rawData) as VC;
                    GoogleNearbyMessages.unsubscribe();
                    callback({ type: 'VC_RECEIVED', vc });
                  } else {
                    await onlineSend({
                      type: 'send-vc:response',
                      data: vcChunk.chunk,
                    });
                  }
                } else {
                  callback({ type: 'VC_RECEIVED', vc });
                }
              },
              () => callback({ type: 'DISCONNECT' }),
              { keepAlive: true }
            );
          }
        },

        sendVcResponse: (context, _event, meta) => async () => {
          const event: SendVcResponseEvent = {
            type: 'send-vc:response',
            data: meta.data.status,
          };

          if (context.sharingProtocol === 'OFFLINE') {
            offlineSend(event, () => {
              // pass
            });
          } else {
            await GoogleNearbyMessages.unpublish();
            await onlineSend(event);
          }
        },

        verifyVp: (context) => async () => {
          const vp = context.incomingVc.verifiablePresentation;

          // TODO
          // const challenge = ?
          // await verifyPresentation(vp, challenge);

          const vc: VC = {
            ...context.incomingVc,
            verifiablePresentation: null,
            verifiableCredential: vp.verifiableCredential[0],
          };

          return Promise.resolve(vc);
        },
      },

      guards: {
        hasExistingVc: (context, event) => {
          const receivedVcs = event.response as string[];
          const vcKey = VC_ITEM_STORE_KEY(context.incomingVc);
          return receivedVcs.includes(vcKey);
        },
      },

      delays: {
        DESTROY_TIMEOUT: 500,
        CONNECTION_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 15 : 5) * 1000;
        },
        SHARING_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 45 : 15) * 1000;
        },
      },
    }
  );

export function createRequestMachine(serviceRefs: AppServices) {
  return requestMachine.withContext({
    ...requestMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof requestMachine>;

export function selectSenderInfo(state: State) {
  return state.context.senderInfo;
}

export function selectConnectionParams(state: State) {
  return state.context.connectionParams;
}

export function selectIncomingVc(state: State) {
  return state.context.incomingVc;
}

export function selectSharingProtocol(state: State) {
  return state.context.sharingProtocol;
}

export function selectIsIncomingVp(state: State) {
  return state.context.incomingVc?.verifiablePresentation != null;
}

export function selectIsCancelling(state: State) {
  return state.matches('cancelling');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectIsAccepting(state: State) {
  return state.matches('reviewing.accepting');
}

export function selectIsSavingFailedInIdle(state: State) {
  return state.matches('reviewing.savingFailed.idle');
}

export function selectIsSavingFailedInViewingVc(state: State) {
  return state.matches('reviewing.savingFailed.viewingVc');
}

export function selectStoreError(state: State) {
  return state.context.storeError;
}

export function selectIsRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectIsVerifyingIdentity(state: State) {
  return state.matches('reviewing.verifyingIdentity');
}

export function selectIsVerifyingVp(state: State) {
  return state.matches('reviewing.verifyingVp');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('reviewing.invalidIdentity');
}

export function selectIsDisconnected(state: State) {
  return state.matches('disconnected');
}

export function selectIsWaitingForConnection(state: State) {
  return state.matches('waitingForConnection');
}

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
}

export function selectIsNearByDevicesPermissionDenied(state: State) {
  return state.matches('nearByDevicesPermissionDenied');
}

export function selectIsCheckingBluetoothService(state: State) {
  return state.matches('checkingBluetoothService');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo.inProgress');
}

export function selectIsExchangingDeviceInfoTimeout(state: State) {
  return state.matches('exchangingDeviceInfo.timeout');
}

export function selectIsWaitingForVc(state: State) {
  return state.matches('waitingForVc.inProgress');
}

export function selectIsWaitingForVcTimeout(state: State) {
  return state.matches('waitingForVc.timeout');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHome');
}

export function selectIsHandlingBleError(state: State) {
  return state.matches('handlingBleError');
}
