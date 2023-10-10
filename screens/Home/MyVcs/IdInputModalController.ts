import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {TextInput} from 'react-native';
import {ModalProps} from '../../../components/ui/Modal';
import {
  AddVcModalEvents,
  AddVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsInvalid,
  selectIsRequestingOtp,
  selectOtpError,
  selectId,
  selectIdError,
  selectIdInputRef,
  selectIdType,
} from './AddVcModalMachine';
import {VcIdType} from '../../../types/VC/ExistingMosipVC/vc';

export function useIdInputModal({service}: IdInputModalProps) {
  return {
    id: useSelector(service, selectId),
    idType: useSelector(service, selectIdType),
    idInputRef: useSelector(service, selectIdInputRef),
    idError: useSelector(service, selectIdError),
    otpError: useSelector(service, selectOtpError),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_ID: (id: string) => service.send(AddVcModalEvents.INPUT_ID(id)),
    SELECT_ID_TYPE: (selectedValue: VcIdType) =>
      service.send(AddVcModalEvents.SELECT_ID_TYPE(selectedValue)),
    VALIDATE_INPUT: () => service.send(AddVcModalEvents.VALIDATE_INPUT()),
    INPUT_OTP: (otp: string) => service.send(AddVcModalEvents.INPUT_OTP(otp)),
    READY: (input: TextInput) => service.send(AddVcModalEvents.READY(input)),
    DISMISS: () => service.send(AddVcModalEvents.DISMISS()),
  };
}

export interface IdInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
  onPress?: () => void;
}
