import * as Keychain from 'react-native-keychain';
import Storage from '../shared/storage';
import binaryToBase64 from 'react-native/Libraries/Utilities/binaryToBase64';
import {
  EventFrom,
  Receiver,
  send,
  sendParent,
  sendUpdate,
  StateFrom,
} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {generateSecureRandom} from 'react-native-securerandom';
import {log} from 'xstate/lib/actions';
import {MY_VCS_STORE_KEY, SETTINGS_STORE_KEY} from '../shared/constants';
import SecureKeystore from 'react-native-secure-keystore';
import {
  AUTH_TIMEOUT,
  decryptJson,
  DUMMY_KEY_FOR_BIOMETRIC_ALIAS,
  ENCRYPTION_ID,
  encryptJson,
  HMAC_ALIAS,
  isHardwareKeystoreExists,
} from '../shared/cryptoutil/cryptoUtil';
import {VCMetadata} from '../shared/VCMetadata';
import {BiometricCancellationError} from '../shared/error/BiometricCancellationError';
import {TelemetryConstants} from '../shared/telemetry/TelemetryConstants';
import {
  sendErrorEvent,
  getErrorEventData,
} from '../shared/telemetry/TelemetryUtils';

export const keyinvalidatedString =
  'Key Invalidated due to biometric enrollment';
export const tamperedErrorMessageString = 'Data is tampered';
export const ENOENT = 'No such file or directory';

const model = createModel(
  {
    encryptionKey: '',
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({key}),
      READY: () => ({}),
      TRY_AGAIN: () => ({}),
      IGNORE: () => ({}),
      GET: (key: string) => ({key}),
      DECRYPT_ERROR: () => ({}),
      KEY_INVALIDATE_ERROR: () => ({}),
      BIOMETRIC_CANCELLED: (requester?: string) => ({requester}),
      SET: (key: string, value: unknown) => ({key, value}),
      APPEND: (key: string, value: unknown) => ({key, value}),
      PREPEND: (key: string, value: unknown) => ({key, value}),
      UPDATE: (key: string, value: string) => ({key, value}),
      REMOVE: (key: string, value: string) => ({key, value}),
      REMOVE_VC_METADATA: (key: string, value: string) => ({key, value}),
      REMOVE_ITEMS: (key: string, values: string[]) => ({key, values}),
      CLEAR: () => ({}),
      ERROR: (error: Error) => ({error}),
      STORE_RESPONSE: (response?: unknown, requester?: string) => ({
        response,
        requester,
      }),
      STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
      TAMPERED_VC: (key: string, requester?: string) => ({key, requester}),
    },
  },
);

export const StoreEvents = model.events;

export type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;

type ForwardedEvent = EventFrom<typeof model> & {requester: string};

export const storeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsBOYB0MUoEsA7KAUSIGMMBPAB0LSIGkxqBiJ0gTQH0AlUgGFSASQBqpACIBtAAwBdRKFppYBBkSUgAHogBMADj3YArAYDMAdnMBOQ5csA2AIzOTAGhDVErt9kcmzrKGznqyBgYm5gC+0Z6omDh4hCTkVHQaLOykfHwA8nxyikggKmoaWroIhsZmVrb2Tq4eXog2AaY2ACyWdjbBhgbOsfHoWLhgRGAYAIYpZJQ09ASMWRzc-EKiEjIKWmXqK5olVdYG2G4OoeYmlgb9ep7eCDYmjtgWJnp6zjaWvo49CMQAlxjAprN5mklplWGwcvlCnsSgcKidECYuu8vs4uuYAtZHBYDE9EJETKY3OZZLcTJi9OYgXEQWMcFhYGB8MQoABlMYzGBsCCMHDEABuaAA1jhQWy4Jz5nzMAKwAhxWgKHMjkUivtVIdGJUfLI-thZFjMRYrJaSa0Xu1sHo6V0TQFHHiTMDZdh2QruUrZoLphhMNhaAAbOYAM0wAFtsN7fVySAGVWqiBLNRodcjlPq0aAqt1jOFgrJbI47JYfqSEAZrJ0uq9ukMotYvayfWAZhB2ABxUgAFV1KPzRyNCFCJlk-kcljxLibekcjlrQVkM-M+IXRK6PxXHcSXZ77B5Q5HefK4-Rk6dM5X8-xuLsK9r-S6F2sNKaBmCRkP4xYCebAAIIAApgaQAByuzFJeBrHIWPh3rOj6Li+q52r+5wbu0PzmJEhjlgBcrAWBAiQTBF6lGOho3lO95zguz7Lphzz-M4HxYs4kRuE6jJdCRx69mwAgALJ5BI1GoteSG3tOqHMUur52i4FJEno873L8dw9EJQEieJkmkDwYiCDwYlDiBkggYOIHSbRiE6Mh5icdWPzOI4shOG2taBDYlI2PiNiRDc7SesyibdoZpASRIPAiIOsU8g5V50XJDGKU+ylsYge7mNgNwmDY-R3PO4ROvp0XsIIAAypAgUicE0WlTlVJlD5KRhtaMpYFx2E2ZxDBulhVcBPKDgUJkCDyYF5FBZ6pQhE5TsY87LgyFjdO0tZhB+5hdDxJrlnoeGyI4Y0iRNU08AiBRLQWzm3nO-jFS4tgVs4BG1kM2BNq4YRzncDJNrEzJEGgEBwFosp6q1E4ALS5QgSNCck3LQhkRxZHDy03nua7ro6056IdVineWo2RZ24LTFqqSLFjqysLjj1VFixj1hEXldG8XnBG+bz+GVh0hUM-xMqMR5Joq-IwKzslPXYM5dE2+IbtS-Q2G+-zYJYZhfUVNjOJYJqXc88Fs8heKFYb5UmtYhOyJxTYhdWxuVu6EWxEAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./store.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'store',
      initial: !isHardwareKeystoreExists
        ? 'gettingEncryptionKey'
        : 'checkEncryptionKey',
      states: {
        checkEncryptionKey: {
          invoke: {
            src: 'hasAndroidEncryptionKey',
          },
          on: {
            READY: {
              target: 'ready',
            },
            ERROR: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        gettingEncryptionKey: {
          invoke: {
            src: 'getEncryptionKey',
          },
          on: {
            KEY_RECEIVED: {
              actions: ['setEncryptionKey'],
              target: 'ready',
            },
            ERROR: {
              target: 'checkStorageInitialisation',
            },
          },
        },
        checkStorageInitialisation: {
          invoke: {
            src: 'checkStorageInitialisedOrNot',
          },
          on: {
            ERROR: {
              target: 'failedReadingKey',
              actions: sendParent('ERROR'),
            },
            READY: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        failedReadingKey: {
          on: {
            TRY_AGAIN: {
              target: 'gettingEncryptionKey',
            },
            IGNORE: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        generatingEncryptionKey: {
          invoke: {
            src: 'generateEncryptionKey',
          },
          on: {
            KEY_RECEIVED: [
              {
                cond: 'isCustomSecureKeystore',
                target: ['ready'],
              },
              {
                actions: 'setEncryptionKey',
                target: 'resettingStorage',
              },
            ],

            ERROR: {
              actions: log('Generating encryption key failed'),
            },
          },
        },
        resettingStorage: {
          invoke: {
            src: 'clear',
            onDone: [
              {
                target: 'ready',
              },
            ],
            onError: [
              {
                actions: log('Resetting storage failed'),
              },
            ],
          },
        },
        ready: {
          entry: 'notifyParent',
          invoke: {
            src: 'store',
            id: '_store',
          },
          on: {
            GET: {
              actions: 'forwardStoreRequest',
            },
            SET: {
              actions: 'forwardStoreRequest',
            },
            APPEND: {
              actions: 'forwardStoreRequest',
            },
            PREPEND: {
              actions: 'forwardStoreRequest',
            },
            UPDATE: {
              actions: 'forwardStoreRequest',
            },
            REMOVE: {
              actions: 'forwardStoreRequest',
            },
            REMOVE_VC_METADATA: {
              actions: 'forwardStoreRequest',
            },
            REMOVE_ITEMS: {
              actions: 'forwardStoreRequest',
            },
            CLEAR: {
              actions: 'forwardStoreRequest',
            },
            STORE_RESPONSE: {
              actions: [
                send(
                  (_, event) => model.events.STORE_RESPONSE(event.response),
                  {
                    to: (_, event) => event.requester,
                  },
                ),
                sendUpdate(),
              ],
            },
            DECRYPT_ERROR: {
              actions: sendParent('DECRYPT_ERROR'),
            },
            TAMPERED_VC: {
              actions: [
                send((_, event) => model.events.TAMPERED_VC(event.key), {
                  to: (_, event) => event.requester,
                }),
              ],
            },
          },
        },
      },
      on: {
        STORE_ERROR: {
          actions: [
            send((_, event) => model.events.STORE_ERROR(event.error), {
              to: (_, event) => event.requester,
            }),
            sendUpdate(),
          ],
        },
        KEY_INVALIDATE_ERROR: {
          actions: sendParent('KEY_INVALIDATE_ERROR'),
        },
        BIOMETRIC_CANCELLED: {
          actions: [
            send(
              (_, event) => model.events.BIOMETRIC_CANCELLED(event.requester),
              {
                to: (_, event) => event.requester,
              },
            ),
            sendUpdate(),
          ],
        },
      },
    },
    {
      actions: {
        notifyParent: sendParent(model.events.READY()),

        forwardStoreRequest: send(
          (_, event, meta) => ({
            ...event,
            requester: meta._event.origin,
          }),
          {to: '_store'},
        ),

        setEncryptionKey: model.assign({
          encryptionKey: (_, event) => event.key,
        }),
      },

      services: {
        clear: () => clear(),
        hasAndroidEncryptionKey: () => async callback => {
          const hasSetCredentials = SecureKeystore.hasAlias(ENCRYPTION_ID);
          if (hasSetCredentials) {
            try {
              await SecureKeystore.encryptData(
                DUMMY_KEY_FOR_BIOMETRIC_ALIAS,
                'Dummy',
              );
            } catch (e) {
              sendErrorEvent(getErrorEventData('ENCRYPTION', '', e));

              if (e.message.includes(keyinvalidatedString)) {
                await clear();
                callback(model.events.KEY_INVALIDATE_ERROR());
                sendUpdate();
              } else {
                callback(model.events.STORE_ERROR(e));
              }
            }
            callback(model.events.READY());
          } else {
            sendErrorEvent(
              getErrorEventData(
                'ENCRYPTION',
                '',
                'Could not get the android Key alias',
              ),
            );
            callback(
              model.events.ERROR(
                new Error('Could not get the android Key alias'),
              ),
            );
          }
        },

        checkStorageInitialisedOrNot: () => async callback => {
          const isDirectoryExist = await Storage.isVCStorageInitialised();
          if (!isDirectoryExist) {
            callback(model.events.READY());
          } else {
            callback(
              model.events.ERROR(
                new Error(
                  'vc directory exists and decryption key is not available',
                ),
              ),
            );
          }
        },

        store: context => (callback, onReceive: Receiver<ForwardedEvent>) => {
          onReceive(async event => {
            try {
              let response: unknown;
              switch (event.type) {
                case 'GET': {
                  response = await getItem(
                    event.key,
                    null,
                    context.encryptionKey,
                  );
                  break;
                }
                case 'SET': {
                  await setItem(event.key, event.value, context.encryptionKey);
                  response = event.value;
                  break;
                }
                case 'APPEND': {
                  await appendItem(
                    event.key,
                    event.value,
                    context.encryptionKey,
                  );
                  response = event.value;
                  break;
                }
                case 'PREPEND': {
                  await prependItem(
                    event.key,
                    event.value,
                    context.encryptionKey,
                  );

                  response = event.value;
                  break;
                }
                case 'UPDATE': {
                  await updateItem(
                    event.key,
                    event.value,
                    context.encryptionKey,
                  );

                  response = event.value;
                  break;
                }
                case 'REMOVE': {
                  await removeItem(
                    event.key,
                    event.value,
                    context.encryptionKey,
                  );
                  response = event.value;
                  break;
                }
                case 'REMOVE_VC_METADATA': {
                  await removeVCMetaData(
                    event.key,
                    event.value,
                    context.encryptionKey,
                  );
                  response = event.value;
                  break;
                }
                case 'REMOVE_ITEMS': {
                  await removeItems(
                    event.key,
                    event.values,
                    context.encryptionKey,
                  );
                  response = event.values;
                  break;
                }
                case 'CLEAR': {
                  await clear();
                  break;
                }
                default:
                  return;
              }
              callback(model.events.STORE_RESPONSE(response, event.requester));
            } catch (e) {
              sendErrorEvent(
                getErrorEventData(
                  TelemetryConstants.FlowType.fetchData,
                  '',
                  e.message,
                  {e},
                ),
              );
              if (e.message.includes(keyinvalidatedString)) {
                await clear();
                callback(model.events.KEY_INVALIDATE_ERROR());
                sendUpdate();
              } else if (
                e.message === tamperedErrorMessageString ||
                e.message === ENOENT
              ) {
                callback(model.events.TAMPERED_VC(event.key, event.requester));
                sendUpdate();
              } else if (
                e.message.includes('JSON') ||
                e.message.includes('decrypt')
              ) {
                callback(model.events.DECRYPT_ERROR());
                sendUpdate();
              } else if (e instanceof BiometricCancellationError) {
                callback(model.events.BIOMETRIC_CANCELLED(event.requester));
                sendUpdate();
              } else {
                console.error(e);
                callback(model.events.STORE_ERROR(e, event.requester));
              }
            }
          });
        },
        getEncryptionKey: () => async callback => {
          const existingCredentials = await Keychain.getGenericPassword();
          if (existingCredentials) {
            console.log('Credentials successfully loaded for user');
            callback(model.events.KEY_RECEIVED(existingCredentials.password));
          } else {
            sendErrorEvent(
              getErrorEventData(
                TelemetryConstants.FlowType.fetchData,
                '',
                'Could not get keychain credentials',
              ),
            );
            console.log('Credentials failed to load for user');
            callback(
              model.events.ERROR(
                new Error('Could not get keychain credentials.'),
              ),
            );
          }
        },
        generateEncryptionKey: () => async callback => {
          const randomBytes = await generateSecureRandom(32);
          const randomBytesString = binaryToBase64(randomBytes);
          if (!isHardwareKeystoreExists) {
            const hasSetCredentials = await Keychain.setGenericPassword(
              ENCRYPTION_ID,
              randomBytesString,
            );

            if (hasSetCredentials) {
              callback(model.events.KEY_RECEIVED(randomBytesString));
            } else {
              sendErrorEvent(
                getErrorEventData(
                  TelemetryConstants.FlowType.fetchData,
                  '',
                  'Could not generate keychain credentials',
                ),
              );
              callback(
                model.events.ERROR(
                  new Error('Could not generate keychain credentials.'),
                ),
              );
            }
          } else {
            const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
            await SecureKeystore.generateKey(
              ENCRYPTION_ID,
              isBiometricsEnabled,
              AUTH_TIMEOUT,
            );
            SecureKeystore.generateHmacshaKey(HMAC_ALIAS);
            SecureKeystore.generateKey(
              DUMMY_KEY_FOR_BIOMETRIC_ALIAS,
              isBiometricsEnabled,
              0,
            );
            callback(model.events.KEY_RECEIVED(''));
          }
        },
      },

      guards: {
        isCustomSecureKeystore: () => isHardwareKeystoreExists,
      },
    },
  );

export async function setItem(
  key: string,
  value: unknown,
  encryptionKey: string,
) {
  try {
    let encryptedData;
    if (key === SETTINGS_STORE_KEY) {
      const appId = value.appId;
      delete value.appId;
      const settings = {
        encryptedData: await encryptJson(encryptionKey, JSON.stringify(value)),
        appId,
      };
      encryptedData = JSON.stringify(settings);
    } else {
      encryptedData = await encryptJson(encryptionKey, JSON.stringify(value));
    }
    await Storage.setItem(key, encryptedData, encryptionKey);
  } catch (e) {
    console.error('error setItem:', e);
    throw e;
  }
}

export async function getItem(
  key: string,
  defaultValue: unknown,
  encryptionKey: string,
) {
  try {
    const data = await Storage.getItem(key, encryptionKey);
    if (data != null) {
      let decryptedData;
      if (key === SETTINGS_STORE_KEY) {
        let parsedData = JSON.parse(data);
        if (parsedData.encryptedData) {
          decryptedData = await decryptJson(
            encryptionKey,
            parsedData.encryptedData,
          );
          parsedData.encryptedData = JSON.parse(decryptedData);
        }
        return parsedData;
      }
      decryptedData = await decryptJson(encryptionKey, data);
      return JSON.parse(decryptedData);
    }
    if (data === null && VCMetadata.isVCKey(key)) {
      await removeItem(key, data, encryptionKey);
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.fetchData,
          TelemetryConstants.ErrorId.tampered,
          tamperedErrorMessageString,
        ),
      );
      throw new Error(tamperedErrorMessageString);
    } else {
      return defaultValue;
    }
  } catch (e) {
    if (
      e.message.includes(tamperedErrorMessageString) ||
      e.message.includes(keyinvalidatedString) ||
      e.message === ENOENT ||
      e instanceof BiometricCancellationError ||
      e.message.includes('Key not found') // this error happens when previous get Item calls failed due to key invalidation and data and keys are deleted
    ) {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.fetchData,
          TelemetryConstants.ErrorId.tampered,
          e.message,
        ),
      );
      throw e;
    }
    sendErrorEvent(
      getErrorEventData(
        TelemetryConstants.FlowType.fetchData,
        TelemetryConstants.ErrorId.tampered,
        `Exception in getting item for ${key}: ${e}`,
      ),
    );
    console.error(`Exception in getting item for ${key}: ${e}`);
    return defaultValue;
  }
}

export async function appendItem(
  key: string,
  value: unknown,
  encryptionKey: string,
) {
  try {
    const list = await getItem(key, [], encryptionKey);
    await setItem(key, [...list, value], encryptionKey);
  } catch (e) {
    console.error('error appendItem:', e);
    throw e;
  }
}

export async function prependItem(
  key: string,
  value: unknown,
  encryptionKey: string,
) {
  try {
    const list = await getItem(key, [], encryptionKey);
    const newList = Array.isArray(value)
      ? [...value, ...list]
      : [value, ...list];

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error prependItem:', e);
    throw e;
  }
}

export async function updateItem(
  key: string,
  value: string,
  encryptionKey: string,
) {
  // Used for updating VC metadata in the list. Prepends the passed vcmetadata in value
  try {
    const list = (await getItem(key, [], encryptionKey)) as Object[];
    const updatedMetaData = VCMetadata.fromVcMetadataString(value);
    const newList = [
      value,
      ...list.map(metadataObj => {
        const metaData = new VCMetadata(metadataObj);
        if (metaData.getVcKey() !== updatedMetaData.getVcKey()) {
          return JSON.stringify(metaData);
        }
      }),
    ].filter(value => value != undefined && value !== null);

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error prependItem:', e);
    throw e;
  }
}

export async function removeItem(
  key: string,
  value: string,
  encryptionKey: string,
) {
  try {
    if (value === null && VCMetadata.isVCKey(key)) {
      await Storage.removeItem(key);
      await removeVCMetaData(MY_VCS_STORE_KEY, key, encryptionKey);
    } else if (key === MY_VCS_STORE_KEY) {
      const data = await Storage.getItem(key, encryptionKey);
      let list: Object[] = [];

      if (data !== null) {
        const decryptedData = await decryptJson(encryptionKey, data);
        list = JSON.parse(decryptedData) as Object[];
      }

      const newList = list.filter((vcMetadataObject: Object) => {
        return new VCMetadata(vcMetadataObject).getVcKey() !== value;
      });

      await setItem(key, newList, encryptionKey);
      await Storage.removeItem(value);
    }
  } catch (e) {
    console.error('error removeItem:', e);
    throw e;
  }
}

export async function removeVCMetaData(
  key: string,
  vcKey: string,
  encryptionKey: string,
) {
  try {
    const data = await Storage.getItem(key, encryptionKey);
    let list: Object[] = [];

    if (data != null) {
      const decryptedData = await decryptJson(encryptionKey, data);
      list = JSON.parse(decryptedData) as Object[];
    }

    const newList = list.filter((vcMetadataObject: Object) => {
      return new VCMetadata(vcMetadataObject).getVcKey() !== vcKey;
    });

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error remove VC metadata:', e);
    throw e;
  }
}

export async function clear() {
  try {
    console.log('clearing entire storage');
    if (isHardwareKeystoreExists) {
      SecureKeystore.clearKeys();
    }
    await Storage.clear();
  } catch (e) {
    console.error('error clear:', e);
    throw e;
  }
}
export async function removeItems(
  key: string,
  values: string[],
  encryptionKey: string,
) {
  try {
    const data = await Storage.getItem(key, encryptionKey);
    let list: Object[] = [];

    if (data !== null) {
      const decryptedData = await decryptJson(encryptionKey, data);
      list = JSON.parse(decryptedData) as Object[];
    }

    const newList = list.filter(
      (vcMetadataObject: Object) =>
        !values.includes(new VCMetadata(vcMetadataObject).getVcKey()),
    );

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error removeItems:', e);
    throw e;
  }
}

type State = StateFrom<typeof storeMachine>;
