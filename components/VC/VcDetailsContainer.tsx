import React from 'react';
import {EsignetMosipVCItemDetails} from './EsignetMosipVCItem/EsignetMosipVCItemDetails';
import {VCMetadata} from '../../shared/VCMetadata';
import {VcDetails} from '../VcDetails';

export const VcDetailsContainer: React.FC = props => {
  if (VCMetadata.fromVC(props.vc.vcMetadata).isFromOpenId4VCI()) {
    return (
      <EsignetMosipVCItemDetails
        vc={undefined}
        isBindingPending={false}
        {...props}
      />
    );
  }
  return <VcDetails isBindingPending={false} {...props} />;
};
