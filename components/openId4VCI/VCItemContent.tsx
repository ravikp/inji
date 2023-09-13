import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground } from 'react-native';

import { CheckBox, Icon } from 'react-native-elements';
import { Column, Row, Text } from '../ui';
import { Theme } from '../ui/styleUtils';
import VerifiedIcon from '../VerifiedIcon';
import { VerifiableCredential } from '../../types/vc';

const getDetails = (arg1, arg2, credential) => {
  return (
    <Column>
      <Text
        weight="bold"
        size="smaller"
        color={
          !credential
            ? Theme.Colors.LoadingDetailsLabel
            : Theme.Colors.DetailsLabel
        }>
        {arg1}
      </Text>
      <Row>
        <Text
          numLines={1}
          color={Theme.Colors.Details}
          weight="bold"
          size="smaller"
          style={
            !credential ? Theme.Styles.loadingTitle : Theme.Styles.subtitle
          }>
          {!credential ? '' : arg2}
        </Text>
        {!credential ? null : <VerifiedIcon />}
      </Row>
    </Column>
  );
};

export const VCItemContent: React.FC<VcItemContentProps> = (props) => {
  //Assigning the UIN and VID from the VC details to display the idtype label

  const fullName = !props.credential
    ? ''
    : props.credential.credentialSubject?.name;
  const { t } = useTranslation('VcDetails');
  const isvalid = !props.credential ? '' : t('valid');
  const selectableOrCheck = props.selectable ? (
    <CheckBox
      checked={props.selected}
      checkedIcon={<Icon name="radio-button-checked" />}
      uncheckedIcon={<Icon name="radio-button-unchecked" />}
      onPress={() => props.onPress()}
    />
  ) : null;

  return (
    <ImageBackground
      source={!props.credential ? null : Theme.CloseCard}
      resizeMode="stretch"
      borderRadius={4}
      style={
        !props.credential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row align="space-between">
          <Row>
            <ImageBackground
              source={
                !props.credential
                  ? Theme.ProfileIcon
                  : { uri: props.context.credential?.biometrics?.face }
              }
              style={Theme.Styles.closeCardImage}>
              {props.iconName && (
                <Icon
                  name={props.iconName}
                  type={props.iconType}
                  color={Theme.Colors.Icon}
                  style={{ marginLeft: -80 }}
                />
              )}
            </ImageBackground>
            <Column margin="0 0 0 10">
              {getDetails(t('fullName'), fullName, props.credential)}

              <Column margin="10 0 0 0">
                <Text
                  color={
                    !props.credential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }
                  weight="semibold"
                  size="smaller"
                  align="left">
                  {t('idType')}
                </Text>
                <Text
                  weight="semibold"
                  color={Theme.Colors.Details}
                  size="smaller"
                  style={
                    !props.credential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.subtitle
                  }>
                  {t('nationalCard')}
                </Text>
              </Column>
            </Column>
          </Row>

          <Column>{props.credential ? selectableOrCheck : null}</Column>
        </Row>

        <Row
          align="space-between"
          margin="5 0 0 0"
          style={!props.credential ? Theme.Styles.loadingContainer : null}>
          <Column>
            {!props.credential
              ? getDetails(t('id'), props.credential?.id, props.credential)
              : null}
            {getDetails(t('generatedOn'), props.generatedOn, props.credential)}
          </Column>
          <Column>
            {props.credential
              ? getDetails(t('status'), isvalid, props.credential)
              : null}
          </Column>
          <Column style={{ display: props.credential ? 'flex' : 'none' }}>
            <Image
              source={Theme.MosipLogo}
              style={Theme.Styles.logo}
              resizeMethod="auto"
            />
          </Column>
        </Row>
      </Column>
    </ImageBackground>
  );
};

interface VcItemContentProps {
  context: any;
  credential: VerifiableCredential;
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}
