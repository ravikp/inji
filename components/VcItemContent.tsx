import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageBackground, View} from 'react-native';
import {getLocalizedField} from '../i18n';
import {VerifiableCredential} from '../types/vc';
import {VcItemTags} from './VcItemTags';
import VerifiedIcon from './VerifiedIcon';
import {Column, Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import testIDProps from '../shared/commonUtil';

const getDetails = (arg1, arg2, verifiableCredential) => {
  if (arg1 === 'Status') {
    return (
      <Column>
        <Text
          testID="status"
          weight="bold"
          size="smaller"
          color={
            !verifiableCredential
              ? Theme.Colors.LoadingDetailsLabel
              : Theme.Colors.DetailsLabel
          }>
          {arg1}
        </Text>
        <Row>
          <Text
            testID="valid"
            numLines={1}
            color={Theme.Colors.Details}
            weight="bold"
            size="smaller"
            style={
              !verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.subtitle
            }>
            {!verifiableCredential ? '' : arg2}
          </Text>
          {!verifiableCredential ? null : <VerifiedIcon />}
        </Row>
      </Column>
    );
  } else {
    return (
      <Column>
        <Text
          color={
            !verifiableCredential
              ? Theme.Colors.LoadingDetailsLabel
              : Theme.Colors.DetailsLabel
          }
          size="smaller"
          weight={'bold'}
          style={Theme.Styles.vcItemLabelHeader}>
          {arg1}
        </Text>
        <Text
          numLines={4}
          color={Theme.Colors.Details}
          weight="bold"
          size="smaller"
          style={
            !verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {!verifiableCredential ? '' : arg2}
        </Text>
      </Column>
    );
  }
};

export const VcItemContent: React.FC<VcItemContentProps> = props => {
  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = props.verifiableCredential?.credentialSubject.UIN;
  const vid = props.verifiableCredential?.credentialSubject.VID;
  const fullName = !props.verifiableCredential
    ? ''
    : getLocalizedField(props.verifiableCredential.credentialSubject.fullName);
  const {t} = useTranslation('VcDetails');
  const isvalid = !props.verifiableCredential ? '' : t('valid');
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
      source={!props.verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      borderRadius={4}
      style={
        !props.verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row align="space-between">
          <Row>
            <ImageBackground
              source={
                !props.verifiableCredential
                  ? Theme.ProfileIcon
                  : {uri: props.context.credential.biometrics.face}
              }
              style={Theme.Styles.closeCardImage}>
              {props.iconName && (
                <Icon
                  {...testIDProps('pinIcon')}
                  name={props.iconName}
                  type={props.iconType}
                  color={Theme.Colors.Icon}
                  style={{marginLeft: -80}}
                />
              )}
            </ImageBackground>
            <Column margin="6 0 0 10">
              <Column>
                <Text
                  testID="fullNameTitle"
                  weight="bold"
                  size="smaller"
                  color={
                    !props.verifiableCredential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }>
                  {t('fullName')}
                </Text>
                <Text
                  testID="fullNameValue"
                  weight="semibold"
                  size="smaller"
                  style={
                    !props.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.subtitle
                  }>
                  {fullName}
                </Text>
              </Column>

              <Column margin="10 0 0 0">
                <Text
                  testID="idType"
                  color={
                    !props.verifiableCredential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }
                  weight="semibold"
                  size="smaller"
                  align="left">
                  {t('idType')}
                </Text>
                <Text
                  testID="nationalCard"
                  weight="semibold"
                  color={Theme.Colors.Details}
                  size="smaller"
                  style={
                    !props.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.subtitle
                  }>
                  {t('nationalCard')}
                </Text>
              </Column>
            </Column>
          </Row>

          <Column>
            {props.verifiableCredential ? selectableOrCheck : null}
          </Column>
        </Row>

        <Row
          align="space-between"
          margin="5 0 0 0"
          style={
            !props.verifiableCredential ? Theme.Styles.loadingContainer : null
          }>
          <Column>
            {uin ? (
              <Column margin="0 0 9 0">
                <Text
                  testID="uin"
                  weight="bold"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('uin')}
                </Text>
                <Text
                  testID="uinNumber"
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {uin}
                </Text>
              </Column>
            ) : null}

            {vid ? (
              <Column margin="0 0 9 0">
                <Text
                  testID="vid"
                  weight="bold"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('vid')}
                </Text>
                <Text
                  testID="vidNumber"
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {vid}
                </Text>
              </Column>
            ) : null}
            {!props.verifiableCredential
              ? getDetails(t('id'), uin || vid, props.verifiableCredential)
              : null}

            <Column>
              <Text
                testID="generatedOnTitle"
                weight="bold"
                size="smaller"
                color={
                  !props.verifiableCredential
                    ? Theme.Colors.LoadingDetailsLabel
                    : Theme.Colors.DetailsLabel
                }>
                {t('generatedOn')}
              </Text>
              <Text
                testID="generatedOnValue"
                weight="semibold"
                size="smaller"
                style={
                  !props.verifiableCredential
                    ? Theme.Styles.loadingTitle
                    : Theme.Styles.subtitle
                }>
                {props.generatedOn}
              </Text>
            </Column>
          </Column>
          <Column>
            {props.verifiableCredential
              ? getDetails(t('status'), isvalid, props.verifiableCredential)
              : null}
          </Column>
          <Column
            testID="logo"
            style={{display: props.verifiableCredential ? 'flex' : 'none'}}>
            <Image
              source={Theme.MosipLogo}
              style={Theme.Styles.logo}
              resizeMethod="auto"
            />
          </Column>
        </Row>
      </Column>
      <VcItemTags tag={props.tag} />
    </ImageBackground>
  );
};

interface VcItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  tag: string;
  selectable: boolean;
  selected: boolean;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}
