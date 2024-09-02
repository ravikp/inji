import jwtDecode from 'jwt-decode';
import jose from 'node-jose';
import {isIOS} from '../constants';
import pem2jwk from 'simple-pem2jwk';
import {displayType, issuerType} from '../../machines/Issuers/IssuersMachine';
import getAllConfigurations, {CACHED_API} from '../api';
import base64url from 'base64url'; 
import i18next from 'i18next';
import {getJWT} from '../cryptoutil/cryptoUtil';
import i18n from '../../i18n';
import {
  CredentialTypes,
  CredentialWrapper,
  VerifiableCredential,
} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import {
  BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS,
  DETAIL_VIEW_ADD_ON_FIELDS,
  getIdType,
  getCredentialTypes,
} from '../../components/VC/common/VCUtils';
import {getVerifiableCredential} from '../../machines/VerifiableCredential/VCItemMachine/VCItemSelectors';
import {vcVerificationBannerDetails} from '../../components/BannerNotificationContainer';
import {getErrorEventData, sendErrorEvent} from '../telemetry/TelemetryUtils';
import {TelemetryConstants} from '../telemetry/TelemetryConstants';
import { NativeModules } from 'react-native';
import { KeyTypes } from '../cryptoutil/KeyTypes';
export const Protocols = {
  OpenId4VCI: 'OpenId4VCI',
  OTP: 'OTP',
};

export const Issuers = {
  MosipOtp: '',
  Mosip: 'Mosip',
};

export function getKeyTypeFromWellknown() {
  return ['RS256','ES256K','ES256'];
}

export function getVcVerificationDetails(
  statusType,
  vcMetadata,
  verifiableCredential,
  wellknown: Object,
): vcVerificationBannerDetails {
  const idType = getIdType(
    wellknown,
    getCredentialTypes(getVerifiableCredential(verifiableCredential)),
  );
  return {
    statusType: statusType,
    vcType: idType,
    vcNumber: vcMetadata.displayId,
  };
}

export const ACTIVATION_NEEDED = [Issuers.Mosip, Issuers.MosipOtp];

export const isActivationNeeded = (issuer: string) => {
  return ACTIVATION_NEEDED.indexOf(issuer) !== -1;
};

export const Issuers_Key_Ref = 'OpenId4VCI_KeyPair';

export const getIdentifier = (context, credential: VerifiableCredential) => {
  //TODO: Format specific
  const credentialIdentifier = credential.credential.id;
  console.log('credentialIdentifier ', credentialIdentifier);
  if (credentialIdentifier === undefined) {
    return (
      context.selectedIssuer.credential_issuer +
      ':' +
      context.selectedIssuer.protocol +
      ':' +
      CredentialIdForMsoMdoc(credential)
    );
  } else {
    const credId = credentialIdentifier.startsWith('did')
      ? credentialIdentifier.split(':')
      : credentialIdentifier.split('/');
    return (
      context.selectedIssuer.credential_issuer +
      ':' +
      context.selectedIssuer.protocol +
      ':' +
      credId[credId.length - 1]
    );
  }
};

//TODO: Remove unused function - getCredentialRequestBody
export const getCredentialRequestBody = async (
  proofJWT: string,
  credentialType: Array<string>,
) => {
  return {
    format: 'ldp_vc',
    credential_definition: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: credentialType,
    },
    proof: {
      proof_type: 'jwt',
      jwt: proofJWT,
    },
  };
};

export const updateCredentialInformation = (
  context,
  credential: VerifiableCredential,
): CredentialWrapper => {
  return {
    verifiableCredential: {
      ...credential,
      wellKnown: context.selectedIssuer['.well-known'],
      credentialConfigurationId: context.selectedCredentialType.id,
      credentialTypes: credential.credential.type ?? ['VerifiableCredential'],
      issuerLogo: getDisplayObjectForCurrentLanguage(
        context.selectedIssuer.display,
      )?.logo,
    },
    format: context.selectedCredentialType.format,
    identifier: getIdentifier(context, credential),
    generatedOn: new Date(),
    vcMetadata:
      {...context.vcMetadata, format: context.selectedCredentialType.format} ||
      {},
  };
};

export const getDisplayObjectForCurrentLanguage = (
  display: [displayType],
): displayType => {
  const currentLanguage = i18next.language;
  const languageKey = Object.keys(display[0]).includes('language')
    ? 'language'
    : 'locale';
  let displayType = display.filter(
    obj => obj[languageKey] == currentLanguage,
  )[0];
  if (!displayType) {
    displayType = display.filter(obj => obj[languageKey] === 'en')[0];
  }
  return displayType;
};

export const constructAuthorizationConfiguration = (
  selectedIssuer: issuerType,
  supportedScope: string,
) => {
  return {
    issuer: selectedIssuer.credential_issuer,
    clientId: selectedIssuer.client_id,
    scopes: [supportedScope],
    redirectUrl: selectedIssuer.redirect_uri,
    additionalParameters: {ui_locales: i18n.language},
    serviceConfiguration: {
      authorizationEndpoint:
        selectedIssuer.authorization_servers[0] + '/authorize',
      tokenEndpoint: selectedIssuer.token_endpoint,
    },
  };
};



export const getSelectedCredentialTypeDetails = (
  wellknown: any,
  vcCredentialTypes: Object[],
): Object => {
  console.log(
    'getSelectedCredentialTypeDetails wellknown ',
    JSON.stringify(wellknown, null, 2),
  );
  console.log(
    'getSelectedCredentialTypeDetails vcCredentialTypes',
    JSON.stringify(vcCredentialTypes, null, 2),
  );
  for (let credential in wellknown.credential_configurations_supported) {
    const credentialDetails =
      wellknown.credential_configurations_supported[credential];
    //TODO: What is t
    if (
      JSON.stringify(credentialDetails.credential_definition?.type) ===
      JSON.stringify(vcCredentialTypes)
    ) {
      return credentialDetails;
    }
  }
  console.error(
    'Selected credential type is not available in wellknown config supported credentials list',
  );
  sendErrorEvent(
    getErrorEventData(
      TelemetryConstants.FlowType.wellknownConfig,
      TelemetryConstants.ErrorId.mismatch,
      TelemetryConstants.ErrorMessage.wellknownConfigMismatch,
    ),
  );
  return {};
};

export const getCredentialIssuersWellKnownConfig = async (
  issuer: string | undefined,
  vcCredentialTypes: Object[] | undefined,
  defaultFields: string[],
  credentialConfigurationId?: string | undefined,
) => {
  let fields: string[] = defaultFields;
  let credentialDetails: any;
  console.log('getCredentialIssuersWellKnownConfig ', issuer);
  const response = await CACHED_API.fetchIssuerWellknownConfig(issuer!);
  if (response) {
    if (credentialConfigurationId) {
      credentialDetails = getMatchingCredentialIssuerMetadata(
        response,
        credentialConfigurationId,
      );
    } else {
      console.log('no credentialConfigurationId is there');

      credentialDetails = getSelectedCredentialTypeDetails(
        response,
        vcCredentialTypes!,
      );
    }
    if (Object.keys(credentialDetails).includes('order')) {
      fields = credentialDetails.order;
    } else {
      console.log('no order is there');
      fields = Object.keys(
        credentialDetails.credential_definition.credentialSubject,
      );
    }
  }
  return {
    wellknown: credentialDetails,
    fields: fields,
  };
};

export const getDetailedViewFields = async (
  issuer: string,
  vcCredentialTypes: Object[],
  credentialConfigurationId: string,
  defaultFields: string[],
) => {
  let response = await getCredentialIssuersWellKnownConfig(
    issuer,
    vcCredentialTypes,
    defaultFields,
    credentialConfigurationId,
  );

  let updatedFieldsList = response.fields.concat(DETAIL_VIEW_ADD_ON_FIELDS);

  updatedFieldsList = removeBottomSectionFields(updatedFieldsList);

  return {
    wellknown: response.wellknown,
    fields: updatedFieldsList,
  };
};

export const removeBottomSectionFields = fields => {
  return fields.filter(
    fieldName =>
      !BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS.includes(fieldName) &&
      fieldName !== 'address',
  );
};

export const vcDownloadTimeout = async (): Promise<number> => {
  const response = await getAllConfigurations();

  return Number(response['openId4VCIDownloadVCTimeout']) || 30000;
};

// OIDCErrors is a collection of external errors from the OpenID library or the issuer
export enum OIDCErrors {
  OIDC_FLOW_CANCELLED_ANDROID = 'User cancelled flow',
  OIDC_FLOW_CANCELLED_IOS = 'org.openid.appauth.general error -3',

  INVALID_TOKEN_SPECIFIED = 'Invalid token specified',
  OIDC_CONFIG_ERROR_PREFIX = 'Config error',
}

// ErrorMessage is the type of error message shown in the UI

export enum ErrorMessage {
  NO_INTERNET = 'noInternetConnection',
  GENERIC = 'generic',
  REQUEST_TIMEDOUT = 'technicalDifficulty',
  BIOMETRIC_CANCELLED = 'biometricCancelled',
  TECHNICAL_DIFFICULTIES = 'technicalDifficulty',
  CREDENTIAL_TYPE_DOWNLOAD_FAILURE = 'credentialTypeListDownloadFailure',
}

export function CredentialIdForMsoMdoc(credential: VerifiableCredential) {
  console.log(
    "JSON.stringify(CredentialIdForMsoMdoc's credential) ",
    JSON.stringify(credential, null, 2),
  );
  return credential.credential['issuerSigned']['nameSpaces'][
    'org.iso.18013.5.1'
  ].find(element => element.elementIdentifier.content === 'document_number')
    .elementValue.content;
}

export function iterateMsoMdocFor(
  credential,
  namespace: string,
  element: 'elementIdentifier' | 'elementValue',
  fieldName: string,
) {
  console.log(
    'iterateMsoMdocFor credential ',
    JSON.stringify(credential, null, 2),
  );
  const foundItem = credential['issuerSigned']['nameSpaces'][namespace].find(
    element => {
      console.log(
        'element inside find bloack ',
        JSON.stringify(element, null, 2),
      );

      return element.elementIdentifier.content === fieldName;
    },
  );
  console.log('finded ', foundItem);
  return foundItem[element].content;
}

export async function constructProofJWT(
  publicKey: string,
  privateKey: string,
  accessToken: string,
  selectedIssuer: issuerType,
  keyType: string
): Promise<string> {
  const jwtHeader = {
    alg: keyType ,
    jwk: await getJWK(publicKey,keyType),
    typ: 'openid4vci-proof+jwt',
  };
  const decodedToken = jwtDecode(accessToken);
  const jwtPayload = {
    iss: selectedIssuer.client_id,
    nonce: decodedToken.c_nonce,
    aud: selectedIssuer.credential_audience,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 18000,
  };

  return await getJWT(jwtHeader, jwtPayload, Issuers_Key_Ref, privateKey,keyType);
}

export const constructIssuerMetaData = (
  selectedIssuer: issuerType,
  selectedCredentialType: CredentialTypes,
  downloadTimeout: Number,
): Object => {
  const issuerMeta: Object = {
    credentialAudience: selectedIssuer.credential_audience,
    credentialEndpoint: selectedIssuer.credential_endpoint,
    downloadTimeoutInMilliSeconds: downloadTimeout,
    credentialFormat: selectedCredentialType.format,
  };
  if (selectedCredentialType.format === 'ldp_vc') {
    issuerMeta['credentialType'] = selectedCredentialType?.credential_definition
      ?.type ?? ['VerifiableCredential'];
  } else if (selectedCredentialType.format === 'mso_mdoc') {
    issuerMeta['docType'] = selectedCredentialType.doctype;
    issuerMeta['claims'] = selectedCredentialType.claims;
  }
  return issuerMeta;
};

export function getMatchingCredentialIssuerMetadata(
  wellknown: any,
  credentialConfigurationId: string,
): any {
  for (const credentialTypeKey in wellknown.credential_configurations_supported) {
    if (credentialTypeKey === credentialConfigurationId) {
      return wellknown.credential_configurations_supported[credentialTypeKey];
    }
  }
  console.error(
    'Selected credential type is not available in wellknown config supported credentials list',
  );
  sendErrorEvent(
    getErrorEventData(
      TelemetryConstants.FlowType.wellknownConfig,
      TelemetryConstants.ErrorId.mismatch,
      TelemetryConstants.ErrorMessage.wellknownConfigMismatch,
    ),
  );
  return {};
}
export const getJWK = async (publicKey,keyType) => {
  try {
    let publicKeyJWK
    switch (keyType) {
      case KeyTypes.RS256:
        publicKeyJWK= await getJWKRSA(publicKey)
        break;
      case KeyTypes.ES256:
        publicKeyJWK= await getJWKECR1(publicKey)
        break;
      case KeyTypes.ES256K:
        publicKeyJWK= await getJWKECK1(publicKey)
        break;
      case KeyTypes.ED25519:
        publicKeyJWK= await getJWKED(publicKey)
        break;
      default:
        throw Error
    }      
    return {
      ...publicKeyJWK,
      alg: keyType,
      use: 'sig',
    };
  } catch (e) {
    console.error(
      'Exception occurred while constructing JWK from PEM : ' +
        publicKey +
        '  Exception is ',
      e,
    );
  }
};
async function getJWKRSA(publicKey): Promise<any> {
  const publicKeyJWKString = await jose.JWK.asKey(publicKey, 'pem');
  return publicKeyJWKString.toJSON();
}
function getJWKECR1(publicKey): any {
  return JSON.parse(publicKey)
}
function getJWKECK1(publicKey): any {
  const x = base64url(Buffer.from(publicKey.slice(1, 33))); // Skip the first byte (0x04) in the uncompressed public key
  const y = base64url(Buffer.from(publicKey.slice(33)));
  const jwk = {
    kty: 'EC',
    crv: 'secp256k1',
    x: x,
    y: y,
  };
  return jwk
}
function getJWKED(publicKey): any {
  throw new Error('Function not implemented.');
}
export async function hasKeyPair(keyType: any):Promise<boolean> {
  const {RNSecureKeystoreModule} = NativeModules;
  try{
    return await RNSecureKeystoreModule.hasAlias(keyType)
  }catch(e){
    console.warn("key not found")
    return false
  }
}

export function selectCredentialRequestKey(keyTypes: string[]) {
  const availableKeys=[KeyTypes.RS256,KeyTypes.ES256K,KeyTypes.ES256,KeyTypes.ED25519]
  for (const key of availableKeys){
    if(keyTypes.includes(key))
    return key
  }
  throw Error;
}

