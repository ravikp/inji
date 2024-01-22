import {Platform} from 'react-native';
import {DEBUG_MODE, ESIGNET_HOST, MIMOTO_HOST} from 'react-native-dotenv';
import {Argon2iConfig} from './commonUtil';
import {VcIdType} from '../types/VC/ExistingMosipVC/vc';

export let MIMOTO_BASE_URL = MIMOTO_HOST;
export let ESIGNET_BASE_URL = ESIGNET_HOST;
export let DEBUG_MODE_ENABLED = DEBUG_MODE === 'true';

export const changeCrendetialRegistry = host => (MIMOTO_BASE_URL = host);
export const changeEsignetUrl = host => (ESIGNET_BASE_URL = host);

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const MY_LOGIN_STORE_KEY = 'myLogins';

export const BACKUP_ENC_KEY = 'backupEncKey';

export const BACKUP_ENC_KEY_TYPE = 'backupEncKeyType';

export const BACKUP_ENC_TYPE_VAL_PASSWORD = 'password';

export const BACKUP_ENC_TYPE_VAL_PHONE = 'phone';

export let individualId = {id: '', idType: 'UIN' as VcIdType};

export const GET_INDIVIDUAL_ID = (currentIndividualId: IndividualId) => {
  individualId = currentIndividualId;
};

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

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

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

export const androidVersion: number = Number(Platform.Version);

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

export const argon2iConfigForBackupFileName: Argon2iConfig = {
  iterations: 5,
  memory: 16 * 1024,
  parallelism: 2,
  hashLength: 8,
  mode: 'argon2id',
};
export const argon2iConfigForPasswordAndPhoneNumber: Argon2iConfig = {
  // TODO: expected iterations for hashing password and phone Number is 600000
  iterations: 500,
  memory: 16 * 1024,
  parallelism: 2,
  hashLength: 30,
  mode: 'argon2id',
};

export const argon2iSalt =
  '1234567891011121314151617181920212223242526272829303132333435363';

export type IndividualId = {
  id: string;
  idType: VcIdType;
};

export const NETWORK_REQUEST_FAILED = 'Network request failed';
export const REQUEST_TIMEOUT = 'request timedout';
export const BIOMETRIC_CANCELLED = 'User has cancelled biometric';

export const CARD_VIEW_DEFAULT_FIELDS = ['fullName'];

export const DETAIL_VIEW_DEFAULT_FIELDS = [
  'fullName',
  'gender',
  'phone',
  'dateOfBirth',
  'email',
  'address',
];

//todo UIN & VID to be removed once we get the fields in the wellknown endpoint
export const CARD_VIEW_ADD_ON_FIELDS = ['idType', 'UIN', 'VID'];
export const DETAIL_VIEW_ADD_ON_FIELDS = [
  'UIN',
  'VID',
  'status',
  'credentialRegistry',
];
