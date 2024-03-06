import {
  AddVcModalEvents,
  AddVcModalMachine,
  selectIsCancellingDownload,
} from './AddVcModalMachine';
import {ActorRefFrom} from 'xstate';
import {ModalProps} from '../../../components/ui/Modal';
import {useSelector} from '@xstate/react';

export function useOtpVerificationModal({service}: OtpVerificationModalProps) {
  return {
    isDownloadCancelled: useSelector(service, selectIsCancellingDownload),

    WAIT: () => service.send(AddVcModalEvents.WAIT()),

    CANCEL: () => service.send(AddVcModalEvents.CANCEL()),
  };
}

export interface OtpVerificationModalProps extends ModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
  onInputDone: (otp: string) => void;
  error?: string;
  resend?: () => void;
  flow: string;
  phone: string;
  email: string;
}
