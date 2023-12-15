import {formatDistanceToNow} from 'date-fns';
import React, {useEffect, useState} from 'react';
import * as DateFnsLocale from 'date-fns/locale';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image, ImageBackground} from 'react-native';
import {Icon} from 'react-native-elements';
import {VC} from '../../../types/VC/ExistingMosipVC/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {TextItem} from '../../ui/TextItem';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  VcIdType,
  VCSharingReason,
  VerifiableCredential,
  VerifiablePresentation,
} from '../../../types/VC/EsignetMosipVC/vc';
import {WalletBindingResponse} from '../../../shared/cryptoutil/cryptoUtil';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {
  DETAIL_VIEW_ADD_ON_FIELDS,
  DETAIL_VIEW_DEFAULT_FIELDS,
} from '../../../shared/constants';
import {
  fieldItemIterator,
  isVCLoaded,
  setBackgroundColour,
} from '../common/VCUtils';
import {logoType} from '../../../machines/issuersMachine';

const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: logoType) => {
  if (isOpenId4VCI) {
    return (
      <Image
        source={{uri: issuerLogo?.url}}
        alt={issuerLogo?.alt_text}
        style={Theme.Styles.issuerLogo}
      />
    );
  }
  return <Image source={Theme.MosipLogo} style={Theme.Styles.vcDetailsLogo} />;
};

const getProfileImage = (
  props: ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps,
  verifiableCredential,
  isOpenId4VCI,
) => {
  if (isOpenId4VCI) {
    if (verifiableCredential?.credentialSubject.face) {
      return {uri: verifiableCredential?.credentialSubject.face};
    }
  } else {
    if (props.vc?.credential?.biometrics?.face) {
      return {uri: props.vc?.credential.biometrics.face};
    }
  }
  return Theme.cardFaceIcon;
};

export const MosipVCItemDetails: React.FC<
  ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps
> = props => {
  const {t, i18n} = useTranslation('VcDetails');

  let isOpenId4VCI = VCMetadata.fromVC(props.vc.vcMetadata).isFromOpenId4VCI();
  const issuerLogo = getIssuerLogo(
    isOpenId4VCI,
    props.vc?.verifiableCredential?.issuerLogo,
  );
  const verifiableCredential = isOpenId4VCI
    ? props.vc?.verifiableCredential.credential
    : props.vc?.verifiableCredential;

  let [fields, setFields] = useState([]);
  const [wellknown, setWellknown] = useState(null);
  useEffect(() => {
    getCredentialIssuersWellKnownConfig(
      VCMetadata.fromVC(props.vc.vcMetadata).issuer,
      props.vc?.verifiableCredential?.wellKnown,
      DETAIL_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields.concat(DETAIL_VIEW_ADD_ON_FIELDS));
    });
  }, [props.verifiableCredential?.wellKnown]);

  if (!isVCLoaded(verifiableCredential, fields)) {
    return <ActivityIndicator />;
  }

  return (
    <Column margin="10 4 10 4">
      <ImageBackground
        imageStyle={{width: '100%'}}
        resizeMethod="scale"
        resizeMode="stretch"
        source={Theme.OpenCard}
        style={[
          Theme.Styles.openCardBgContainer,
          setBackgroundColour(wellknown),
        ]}>
        <Row padding="10" margin="0 10 0 8">
          <Column crossAlign="center">
            <Image
              source={getProfileImage(
                props,
                verifiableCredential,
                isOpenId4VCI,
              )}
              style={Theme.Styles.openCardImage}
            />

            <QrCodeOverlay qrCodeDetailes={String(verifiableCredential)} />
            <Column margin="20 0 0 0">{issuerLogo}</Column>
          </Column>
          <Column align="space-evenly" margin={'0 0 0 10'} style={{flex: 1}}>
            {fieldItemIterator(fields, verifiableCredential, wellknown)}
          </Column>
        </Row>
      </ImageBackground>

      {props.vc?.reason?.length > 0 && (
        <Text
          testID="reasonForSharingTitle"
          margin="24 24 16 24"
          weight="semibold">
          {t('reasonForSharing')}
        </Text>
      )}

      {props.vc?.reason?.map((reason, index) => (
        <TextItem
          testID="reason"
          key={index}
          divider
          label={formatDistanceToNow(reason.timestamp, {
            addSuffix: true,
            locale: DateFnsLocale[i18n.language],
          })}
          text={reason.message}
        />
      ))}

      {props.activeTab !== 1 ? (
        props.isBindingPending ? (
          <Column style={Theme.Styles.openCardBgContainer} padding="10">
            <Column margin={'0 0 4 0'} crossAlign={'flex-start'}>
              <Icon
                name="shield-alert"
                color={Theme.Colors.Icon}
                size={Theme.ICON_LARGE_SIZE}
                type="material-community"
                containerStyle={{
                  marginEnd: 5,
                  bottom: 1,
                }}
              />
              <Text
                testID="offlineAuthDisabledHeader"
                style={{flex: 1}}
                weight="semibold"
                size="small"
                margin={'5 0 0 0'}
                color={Theme.Colors.statusLabel}>
                {t('offlineAuthDisabledHeader')}
              </Text>
            </Column>
            <Text
              testID="offlineAuthDisabledMessage"
              style={{flex: 1, lineHeight: 17}}
              weight="regular"
              size="small"
              margin={'3 0 0 0'}
              color={Theme.Colors.statusMessage}>
              {t('offlineAuthDisabledMessage')}
            </Text>

            <Button
              testID="enableVerification"
              title={t('enableVerification')}
              onPress={props.onBinding}
              type="gradient"
              styles={{width: '100%'}}
            />
          </Column>
        ) : (
          <Column style={Theme.Styles.openCardBgContainer} padding="10">
            <Row crossAlign="center">
              <Icon
                name="verified-user"
                color={Theme.Colors.VerifiedIcon}
                size={28}
                containerStyle={{marginStart: 4, bottom: 1}}
              />
              <Text
                testID="profileAuthenticated"
                numLines={1}
                color={Theme.Colors.statusLabel}
                weight="bold"
                size="smaller"
                margin="10 10 10 10"
                children={t('profileAuthenticated')}></Text>
            </Row>
          </Column>
        )
      ) : (
        <></>
      )}
    </Column>
  );
};

export interface ExistingMosipVCItemDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: Number;
}

export interface EsignetMosipVCItemDetailsProps {
  vc: EsignetVC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: number;
}

export interface EsignetVC {
  id: string;
  idType: VcIdType;
  verifiableCredential: VerifiableCredential;
  verifiablePresentation?: VerifiablePresentation;
  generatedOn: Date;
  requestId: string;
  isVerified: boolean;
  lastVerifiedOn: number;
  locked: boolean;
  reason?: VCSharingReason[];
  shouldVerifyPresence?: boolean;
  walletBindingResponse?: WalletBindingResponse;
  credentialRegistry: string;
  isPinned?: boolean;
  hashedId: string;
}
