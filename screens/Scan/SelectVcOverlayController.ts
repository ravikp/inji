import {useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {VC} from '../../types/VC/ExistingMosipVC/vc';
import {VCMetadata} from '../../shared/VCMetadata';

export function useSelectVcOverlay(props: SelectVcOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVcRef, setSelectedVcRef] =
    useState<ActorRefFrom<typeof ExistingMosipVCItemMachine>>(null);

  return {
    selectVcItem,
    selectedIndex,

    onSelect: () => {
      const {serviceRefs, ...vc} = selectedVcRef.getSnapshot().context;
      props.onSelect(vc);
    },

    onVerifyAndSelect: () => {
      const {serviceRefs, ...vc} = selectedVcRef.getSnapshot().context;
      props.onVerifyAndSelect(vc);
    },
  };

  function selectVcItem(index: number) {
    return (vcRef: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => {
      setSelectedIndex(index);
      setSelectedVcRef(vcRef);
    };
  }
}

export interface SelectVcOverlayProps {
  isVisible: boolean;
  receiverName: string;
  vcMetadatas: VCMetadata[];
  onSelect: (vc: VC) => void;
  onVerifyAndSelect: (vc: VC) => void;
  onCancel: () => void;
}
