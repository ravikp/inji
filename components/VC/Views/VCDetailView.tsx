import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageBackground, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {VC} from '../../../types/VC/ExistingMosipVC/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  VcIdType,
  VerifiableCredential,
  VerifiablePresentation,
} from '../../../types/VC/EsignetMosipVC/vc';
import {WalletBindingResponse} from '../../../shared/cryptoutil/cryptoUtil';
import {logoType} from '../../../machines/issuersMachine';
import {SvgImage} from '../../ui/svg';
import {
  getDetailedViewFields,
  isActivationNeeded,
} from '../../../shared/openId4VCI/Utils';
import {
  BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS,
  DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
  DETAIL_VIEW_DEFAULT_FIELDS,
  fieldItemIterator,
  isVCLoaded,
  setBackgroundColour,
} from '../common/VCUtils';
import {setTextColor} from '../common/VCItemField';
import {ActivityIndicator} from '../../ui/ActivityIndicator';
import {ProfileIcon} from '../../ProfileIcon';

const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: logoType) => {
  if (isOpenId4VCI) {
    return (
      <Image
        testID="esignetLogo"
        src={issuerLogo?.url}
        alt={issuerLogo?.alt_text}
        style={Theme.Styles.issuerLogo}
      />
    );
  }
  return SvgImage.MosipLogo(Theme.Styles.vcDetailsLogo);
};

const getProfileImage = (
  props: ExistingVCItemDetailsProps | EsignetVCItemDetailsProps,
  verifiableCredential,
  isOpenId4VCI,
) => {
  if (isOpenId4VCI) {
    if (verifiableCredential?.credentialSubject?.face) {
      return (
        <Image
          source={{uri: verifiableCredential?.credentialSubject.face}}
          style={Theme.Styles.detailedViewImage}
        />
      );
    }
  } else if (props?.vc?.credential?.biometrics?.face) {
    return (
      <Image
        source={{uri: props?.vc?.credential.biometrics.face}}
        style={Theme.Styles.detailedViewImage}
      />
    );
  }
  return (
    <ProfileIcon
      profileIconContainerStyles={Theme.Styles.openCardProfileIconContainer}
      profileIconSize={40}
    />
  );
};

export const VCDetailView: React.FC<
  ExistingVCItemDetailsProps | EsignetVCItemDetailsProps
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
    getDetailedViewFields(
      VCMetadata.fromVC(props.vc.vcMetadata).issuer,
      props.vc?.verifiableCredential?.wellKnown,
      props.vc?.verifiableCredential?.credentialTypes,
      DETAIL_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields);
    });
  }, [props.verifiableCredential?.wellKnown]);

  const shouldShowHrLine = verifiableCredential => {
    const availableFieldNames = Object.keys(
      verifiableCredential?.credentialSubject,
    );

    for (const fieldName of availableFieldNames) {
      if (
        BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS.includes(fieldName)
      ) {
        return true;
      }
    }

    return false;
  };

  if (!isVCLoaded(verifiableCredential, fields)) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Column scroll>
        <Column fill>
          <Column
            padding="10 10 3 10"
            backgroundColor={Theme.Colors.DetailedViewBackground}>
            <ImageBackground
              imageStyle={{width: '100%'}}
              resizeMethod="scale"
              resizeMode="stretch"
              style={[
                Theme.Styles.openCardBgContainer,
                setBackgroundColour(wellknown),
              ]}
              source={Theme.OpenCard}>
              <Row padding="14 14 0 14" margin="0 0 0 0">
                <Column crossAlign="center">
                  {getProfileImage(props, verifiableCredential, isOpenId4VCI)}
                  <QrCodeOverlay qrCodeDetails={String(verifiableCredential)} />
                  <Column
                    width={80}
                    height={59}
                    crossAlign="center"
                    margin="12 0 0 0">
                    {issuerLogo}
                  </Column>
                </Column>
                <Column
                  align="space-evenly"
                  margin={'0 0 0 24'}
                  style={{flex: 1}}>
                  {fieldItemIterator(
                    fields,
                    verifiableCredential,
                    wellknown,
                    props,
                  )}
                </Column>
              </Row>
              {shouldShowHrLine(verifiableCredential) && (
                <>
                  <View
                    style={[
                      Theme.Styles.hrLine,
                      {
                        borderBottomColor: setTextColor(wellknown, 'hrLine')
                          ?.color,
                      },
                    ]}></View>
                  <Column padding="0 14 14 14">
                    {fieldItemIterator(
                      DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
                      verifiableCredential,
                      wellknown,
                      props,
                    )}
                  </Column>
                </>
              )}
            </ImageBackground>
          </Column>
        </Column>
      </Column>
      {props.vcHasImage ? (
        <View
          style={{
            position: 'relative',
            backgroundColor: Theme.Colors.DetailedViewBackground,
          }}>
          {props.activeTab !== 1 ? (
            props.isBindingPending &&
            isActivationNeeded(props.vc.vcMetadata.issuer) ? (
              <Column
                padding="10"
                style={Theme.Styles.detailedViewActivationPopupContainer}>
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletUnActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="offlineAuthDisabledHeader"
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      color={Theme.Colors.statusLabel}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledHeader')}
                    </Text>
                    <Text
                      testID="offlineAuthDisabledMessage"
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                      }}
                      color={Theme.Colors.statusMessage}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledMessage')}
                    </Text>
                  </Column>
                </Row>

                <Button
                  testID="enableVerification"
                  title={t('enableVerification')}
                  onPress={props.onBinding}
                  type="gradient"
                  size="Large"
                />
              </Column>
            ) : (
              <Column
                style={Theme.Styles.detailedViewActivationPopupContainer}
                padding="10">
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="profileAuthenticated"
                      color={Theme.Colors.statusLabel}
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      margin={'0 18 0 0'}>
                      {isActivationNeeded(props.vc.vcMetadata.issuer)
                        ? t('profileAuthenticated')
                        : t('credentialActivated')}
                    </Text>
                  </Column>
                </Row>
              </Column>
            )
          ) : (
            <></>
          )}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export interface ExistingVCItemDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: Number;
  vcHasImage: boolean;
}

export interface EsignetVCItemDetailsProps {
  vc: EsignetVC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: number;
  vcHasImage: boolean;
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
  shouldVerifyPresence?: boolean;
  walletBindingResponse?: WalletBindingResponse;
  credentialRegistry: string;
  isPinned?: boolean;
  hashedId: string;
}
