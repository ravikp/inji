import {KeyPair, RSA} from 'react-native-rsa-native';
import forge from 'node-forge';
import {BIOMETRIC_CANCELLED, DEBUG_MODE_ENABLED, isIOS} from '../constants';
import {NativeModules} from 'react-native';
import {BiometricCancellationError} from '../error/BiometricCancellationError';
import {EncryptedOutput} from './encryptedOutput';
import {Buffer} from 'buffer';
import base64url from 'base64url';
import {hmac} from '@noble/hashes/hmac';
import {sha256} from '@noble/hashes/sha256';
import 'react-native-get-random-values';
import * as secp from '@noble/secp256k1';
import {getKeyTypeFromWellknown} from '../openId4VCI/Utils';
secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));
secp.etc.hmacSha256Async = (k, ...m) =>
  Promise.resolve(secp.etc.hmacSha256Sync(k, ...m));

// 5min
export const AUTH_TIMEOUT = 5 * 60;
export const ENCRYPTION_ID = 'c7c22a6c-9759-4605-ac88-46f4041d863d';
export const HMAC_ALIAS = '860cc320-4248-11ee-be56-0242ac120002';
//This key is used to request biometric at app open to reset auth timeout which is used by encryption key
export const DUMMY_KEY_FOR_BIOMETRIC_ALIAS =
  '9a6cfc0e-4248-11ee-be56-0242ac120002';

export function generateKeys(): Promise<KeyPair> {
  return Promise.resolve(RSA.generateKeys(2048));
}

/**
 * isCustomKeystore is a cached check of existence of a hardware keystore.
 */
const {RNSecureKeystoreModule} = NativeModules;
export const isHardwareKeystoreExists = isCustomSecureKeystore(
  getKeyTypeFromWellknown(),
);

export async function getJWTECK1(
  header: object,
  payLoad: object,
  alias: string,
  privateKey: any,
) {
  try {
    const header64 = encodeB64(JSON.stringify(header));
    const payLoad64 = encodeB64(JSON.stringify(payLoad));
    const preHash = header64 + '.' + payLoad64;
    const signature64 = await createSignatureECK1(privateKey, preHash);
    console.log(
      'sign hereL: ' + header64 + '.' + payLoad64 + '.' + signature64,
    );
    return header64 + '.' + payLoad64 + '.' + signature64;
  } catch (e) {
    console.error('Exception Occurred While Constructing JWT ', e);
    throw e;
  }
}

export async function getJWT(
  header: object,
  payLoad: object,
  alias: string,
  privateKey: string,
) {
  try {
    const header64 = encodeB64(JSON.stringify(header));
    const payLoad64 = encodeB64(JSON.stringify(payLoad));
    const preHash = header64 + '.' + payLoad64;
    const signature64 = await createSignature(privateKey, preHash, alias);
    return header64 + '.' + payLoad64 + '.' + signature64;
  } catch (e) {
    console.error('Exception Occurred While Constructing JWT ', e);
    throw e;
  }
}

export async function createSignatureECK1(privateKey, prehash) {
  const sha = sha256(prehash);
  const sign = await secp.signAsync(sha, privateKey);
  return base64url(Buffer.from(sign.toCompactRawBytes()));
}
export async function createSignature(
  privateKey: string,
  preHash: string,
  alias: string,
) {
  let signature64;

  if (!isHardwareKeystoreExists) {
    const key = forge.pki.privateKeyFromPem(privateKey);
    const md = forge.md.sha256.create();
    md.update(preHash, 'utf8');

    const signature = key.sign(md);
    return encodeB64(signature);
  } else {
    try {
      signature64 = await RNSecureKeystoreModule.sign('RSA256', alias, preHash);
    } catch (error) {
      console.error('Error in creating signature:', error);
      if (error.toString().includes(BIOMETRIC_CANCELLED)) {
        throw new BiometricCancellationError(error.toString());
      }
      throw error;
    }

    return replaceCharactersInB64(signature64);
  }
}

function replaceCharactersInB64(encodedB64: string) {
  return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function encodeB64(str: string) {
  const encodedB64 = forge.util.encode64(str);
  return replaceCharactersInB64(encodedB64);
}

/**
 * DO NOT USE DIRECTLY and/or REPEATEDLY in application lifeycle.
 *
 * This can make a call to the Android native layer hence taking up more time,
 *  use the isCustomKeystore constant in the app lifeycle instead.
 */
function isCustomSecureKeystore(keyType) {
  return !isIOS()
    ? RNSecureKeystoreModule.deviceSupportsHardware()
    : false
    ? 'RSA256' || 'ES256' //move to same function
    : false;
}

export async function encryptJson(
  encryptionKey: string,
  data: string,
): Promise<string> {
  try {
    // Disable Encryption in debug mode
    if (DEBUG_MODE_ENABLED && __DEV__) {
      return JSON.stringify(data);
    }

    if (!isHardwareKeystoreExists) {
      return encryptWithForge(data, encryptionKey).toString();
    }
    const base64EncodedString = Buffer.from(data).toString('base64');
    return await RNSecureKeystoreModule.encryptData(
      ENCRYPTION_ID,
      base64EncodedString,
    );
  } catch (error) {
    console.error('error while encrypting:', error);
    if (error.toString().includes(BIOMETRIC_CANCELLED)) {
      throw new BiometricCancellationError(error.toString());
    }
    throw error;
  }
}

export async function decryptJson(
  encryptionKey: string,
  encryptedData: string,
): Promise<string> {
  try {
    if (encryptedData === null || encryptedData === undefined) {
      // to avoid crash in case of null or undefined
      return '';
    }
    // Disable Encryption in debug mode
    if (DEBUG_MODE_ENABLED && __DEV__) {
      return JSON.parse(encryptedData);
    }

    if (!isHardwareKeystoreExists) {
      return decryptWithForge(encryptedData, encryptionKey);
    }

    return await RNSecureKeystoreModule.decryptData(
      ENCRYPTION_ID,
      encryptedData,
    );
  } catch (e) {
    console.error('error decryptJson:', e);

    if (e.toString().includes(BIOMETRIC_CANCELLED)) {
      throw new BiometricCancellationError(e.toString());
    }
    throw e;
  }
}

function encryptWithForge(text: string, key: string): EncryptedOutput {
  //iv - initialization vector
  const iv = forge.random.getBytesSync(16);
  const salt = forge.random.getBytesSync(128);
  const encryptionKey = forge.pkcs5.pbkdf2(key, salt, 4, 16);
  const cipher = forge.cipher.createCipher('AES-CBC', encryptionKey);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(text, 'utf8'));
  cipher.finish();
  var cipherText = forge.util.encode64(cipher.output.getBytes());
  const encryptedData = new EncryptedOutput(
    cipherText,
    forge.util.encode64(iv),
    forge.util.encode64(salt),
  );
  return encryptedData;
}

function decryptWithForge(encryptedData: string, key: string): string {
  const encryptedOutput = EncryptedOutput.fromString(encryptedData);
  const salt = forge.util.decode64(encryptedOutput.salt);
  const encryptionKey = forge.pkcs5.pbkdf2(key, salt, 4, 16);
  const decipher = forge.cipher.createDecipher('AES-CBC', encryptionKey);
  decipher.start({iv: forge.util.decode64(encryptedOutput.iv)});
  decipher.update(
    forge.util.createBuffer(forge.util.decode64(encryptedOutput.encryptedData)),
  );
  decipher.finish();
  const decryptedData = decipher.output.toString();
  return decryptedData;
}

export function hmacSHA(encryptionKey: string, data: string) {
  const hmac = forge.hmac.create();
  hmac.start('sha256', encryptionKey);
  hmac.update(data);
  const resultBytes = hmac.digest().getBytes().toString();
  return resultBytes;
}
