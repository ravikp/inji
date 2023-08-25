import { Platform } from 'react-native';
import { VC } from '../types/vc';
import {
  MIMOTO_HOST,
  GOOGLE_NEARBY_MESSAGES_API_KEY,
} from 'react-native-dotenv';
import { Argon2iConfig } from './commonUtil';

export let HOST = MIMOTO_HOST;

export const changeCrendetialRegistry = (host) => (HOST = host);

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const MY_LOGIN_STORE_KEY = 'myLogins';

export const VC_ITEM_STORE_KEY = (vc: Partial<VC>) =>
  `vc:${vc.idType}:${vc.id}:${vc.requestId}:${vc.isPinned}`;

//Regex expression to evaluate if the key is for a VC
export const VC_ITEM_STORE_KEY_REGEX =
  '^vc:(UIN|VID):[0-9]+:[a-z0-9-]+:[true|false]+$';

//To compare the vckey with requestId, when the vc is pinned
export const isSameVC = (vcKey: string, pinnedVcKey: string) => {
  const requestId = vcKey.split(':')[3];
  const pinnedRequestId = pinnedVcKey.split(':')[3];
  return requestId === pinnedRequestId;
};

export let individualId = '';

export const GET_INDIVIDUAL_ID = (ind_Id: string) => {
  individualId = ind_Id;
};

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const ONBOARDING_STATUS_STORE_KEY = 'isOnboardingDone';

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
