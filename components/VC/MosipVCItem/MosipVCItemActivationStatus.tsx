import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';

const WalletUnverifiedIcon: React.FC = () => {
  return (
    <Icon
      name="shield-alert"
      color={Theme.Colors.Icon}
      size={Theme.ICON_MID_SIZE}
      type="material-community"
      containerStyle={{marginStart: 10, bottom: 1, marginLeft: 10}}
    />
  );
};

const WalletVerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={Theme.ICON_MID_SIZE}
      containerStyle={{marginStart: 10, bottom: 1, marginLeft: 10}}
    />
  );
};

const WalletUnverifiedActivationDetails: React.FC<
  WalletUnVerifiedDetailsProps
> = props => {
  const {t} = useTranslation('VcDetails');
  return (
    <Row
      width={Dimensions.get('screen').width * 0.8}
      align="space-between"
      crossAlign="center">
      <Row
        crossAlign="center"
        style={{
          flex: 1,
        }}>
        {props.verifiableCredential && <WalletUnverifiedIcon />}
        <Text
          color={Theme.Colors.Details}
          testID="activationPending"
          weight="regular"
          margin="8 10 10 5"
          style={
            !props.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.statusLabel
          }
          children={t('offlineAuthDisabledHeader')}></Text>
      </Row>
    </Row>
  );
};

const WalletVerifiedActivationDetails: React.FC<
  WalletVerifiedDetailsProps
> = props => {
  const {t} = useTranslation('WalletBinding');
  return (
    <Row
      width={Dimensions.get('screen').width * 0.8}
      align="space-between"
      crossAlign="center">
      <Row
        crossAlign="center"
        style={{
          flex: 1,
        }}>
        <WalletVerifiedIcon />
        <Text
          color={Theme.Colors.statusLabel}
          testID="activated"
          weight="regular"
          size="smaller"
          margin="8 10 10 5"
          style={
            !props.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.statusLabel
          }
          children={t('profileAuthenticated')}></Text>
      </Row>
    </Row>
  );
};

export const MosipVCItemActivationStatus: React.FC<
  ExistingMosipVCItemActivationStatusProps
> = props => {
  return (
    <Row margin="0 0 0 -6">
      {props.emptyWalletBindingId ? (
        <WalletUnverifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          onPress={props.onPress}
        />
      ) : (
        <WalletVerifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          showOnlyBindedVc={props.showOnlyBindedVc}
          onPress={props.onPress}
        />
      )}
    </Row>
  );
};

interface ExistingMosipVCItemActivationStatusProps {
  showOnlyBindedVc: boolean;
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
  emptyWalletBindingId: boolean;
}

interface WalletVerifiedDetailsProps {
  showOnlyBindedVc: boolean;
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
}

interface WalletUnVerifiedDetailsProps {
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
}
