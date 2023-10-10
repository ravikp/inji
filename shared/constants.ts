import {Platform} from 'react-native';
import {
  MIMOTO_HOST,
  ESIGNET_HOST,
  GOOGLE_NEARBY_MESSAGES_API_KEY,
  DEBUG_MODE,
} from 'react-native-dotenv';
import {Argon2iConfig} from './commonUtil';

export let MIMOTO_BASE_URL = MIMOTO_HOST;
export let ESIGNET_BASE_URL = ESIGNET_HOST;
export let DEBUG_MODE_ENABLED = DEBUG_MODE === 'true';

export const changeCrendetialRegistry = host => (MIMOTO_BASE_URL = host);
export const changeEsignetUrl = host => (ESIGNET_BASE_URL = host);

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const MY_LOGIN_STORE_KEY = 'myLogins';

export let individualId = '';

export const GET_INDIVIDUAL_ID = (ind_Id: string) => {
  individualId = ind_Id;
};

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const GNM_API_KEY = GOOGLE_NEARBY_MESSAGES_API_KEY;

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message#MAX_CONTENT_SIZE_BYTES
export const GNM_MESSAGE_LIMIT = 102400 - 6400; // allowance for metadata

export const APP_ID_LENGTH = 12;

// Numbers and Upper case Alphabets without confusing characters like 0, 1, 2, I, O, Z
// prettier-ignore
export const APP_ID_DICTIONARY = [
  '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L',
  'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
];

export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

// Configuration for argon2i hashing algorithm
export const argon2iConfig: Argon2iConfig = {
  iterations: 5,
  memory: 16 * 1024,
  parallelism: 2,
  hashLength: 20,
  mode: 'argon2i',
};

export const argon2iConfigForUinVid: Argon2iConfig = {
  iterations: 5,
  memory: 16 * 1024,
  parallelism: 2,
  hashLength: 5,
  mode: 'argon2i',
};

export const argon2iSalt =
  '1234567891011121314151617181920212223242526272829303132333435363';
