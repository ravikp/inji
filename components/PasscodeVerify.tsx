import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from './PinInput';
import { hashData } from '../shared/commonUtil';
import { argon2iConfig } from '../shared/constants';

export const MAX_PIN = 6;

export const PasscodeVerify: React.FC<PasscodeVerifyProps> = (props) => {
  const { t } = useTranslation('PasscodeVerify');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isVerified) {
      props.onSuccess();
    }
  }, [isVerified]);

  return (
    <PinInput testID="confirmPasscodePin" length={MAX_PIN} onDone={verify} />
  );

  async function verify(value: string) {
    const hashedPasscode = await hashData(value, props.salt, argon2iConfig);
    if (props.passcode === hashedPasscode) {
      setIsVerified(true);
    } else {
      props.onError(t('passcodeMismatchError'));
    }
  }
};

interface PasscodeVerifyProps {
  passcode: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
  salt: string;
}
