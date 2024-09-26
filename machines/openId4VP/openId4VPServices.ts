import {CACHED_API} from '../../shared/api';
import {fetchKeyPair} from '../../shared/cryptoutil/cryptoUtil';
import {__AppId} from '../../shared/GlobalVariables';
import {
  constructProofJWT,
  OpenID4VP,
  OpenID4VP_Domain,
  OpenID4VP_Proof_Algo_Type,
} from '../../shared/openId4VP/OpenID4VP';

export const openId4VPServices = () => {
  return {
    fetchTrustedVerifiers: async () => {
      return await CACHED_API.fetchTrustedVerifiersList();
    },

    getAuthenticationResponse: (context: any) => async () => {
      OpenID4VP.initialize();
      const serviceRes = await OpenID4VP.authenticateVerifier(
        context.encodedAuthorizationRequest,
        context.trsutedVerifiers,
      );
      return serviceRes;
    },

    getKeyPair: async (context: any) => {
      if (!!(await fetchKeyPair(context.keyType)).publicKey) {
        return await fetchKeyPair(context.keyType);
      }
    },

    getSelectedKey: async (context: any) => {
      return await fetchKeyPair(context.keyType);
    },

    sendVP: (context: any) => async () => {
      const vpToken = await OpenID4VP.constructVerifiablePresentationToken(
        context.selectedVCs,
      );

      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        JSON.parse(vpToken),
        context.keyType,
      );

      const vpResponseMetadata = {
        jws: proofJWT,
        signatureAlgorithm: OpenID4VP_Proof_Algo_Type,
        publicKey: context.publicKey,
        domain: OpenID4VP_Domain,
      };
      return await OpenID4VP.shareVerifiablePresentation(vpResponseMetadata);
    },
  };
};
