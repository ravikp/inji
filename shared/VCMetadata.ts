import {VC, VcIdType} from '../types/VC/ExistingMosipVC/vc';
import {Protocols} from './openId4VCI/Utils';

const VC_KEY_PREFIX = 'VC';
const VC_ITEM_STORE_KEY_REGEX = '^VC_[a-zA-Z0-9_-]+$';

export class VCMetadata {
  idType: VcIdType | string = '';
  requestId = '';
  isPinned = false;
  id: string = '';

  issuer?: string = '';
  protocol?: string = '';
  static vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);

  constructor({
    idType = '',
    requestId = '',
    isPinned = false,
    id = '',
    issuer = '',
    protocol = '',
  } = {}) {
    this.idType = idType;
    this.requestId = requestId;
    this.isPinned = isPinned;
    this.id = id;
    this.protocol = protocol;
    this.issuer = issuer;
  }

  //TODO: Remove any typing and use appropriate typing
  static fromVC(vc: Partial<VC> | VCMetadata | any) {
    return new VCMetadata({
      idType: vc.idType,
      requestId: vc.requestId,
      isPinned: vc.isPinned || false,
      id: vc.id,
      protocol: vc.protocol,
      issuer: vc.issuer,
    });
  }

  static fromVcMetadataString(vcMetadataStr: string) {
    try {
      if (typeof vcMetadataStr === 'object')
        return new VCMetadata(vcMetadataStr);
      return new VCMetadata(JSON.parse(vcMetadataStr));
    } catch (e) {
      console.error('Failed to parse VC Metadata', e);
      return new VCMetadata();
    }
  }

  static isVCKey(key: string): boolean {
    return VCMetadata.vcKeyRegExp.exec(key) != null;
  }

  isFromOpenId4VCI() {
    return this.protocol === Protocols.OpenId4VCI;
  }

  // Used for mmkv storage purposes and as a key for components and vc maps
  // Update VC_ITEM_STORE_KEY_REGEX in case of changes in vckey
  getVcKey(): string {
    return `${VC_KEY_PREFIX}_${this.requestId}`;
  }

  equals(other: VCMetadata): boolean {
    return this.getVcKey() === other.getVcKey();
  }
}

export function parseMetadatas(metadataStrings: object[]) {
  return metadataStrings.map(o => new VCMetadata(o));
}
