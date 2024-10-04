/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */

import {ControllerProofPurpose} from './ControllerProofPurpose';

export class PublicKeyProofPurpose extends ControllerProofPurpose {
  constructor({controller, date, maxTimestampDelta = Infinity}: any = {}) {
    super({term: 'publicKey', controller, date, maxTimestampDelta});
  }

  async update(proof) {
    // do not add `term` to proof
    return proof;
  }

  async match(proof) {
    // `proofPurpose` must not be present in the proof to match as this
    // proof purpose is a legacy, non-descript purpose for signing
    return proof.proofPurpose === undefined;
  }
}
