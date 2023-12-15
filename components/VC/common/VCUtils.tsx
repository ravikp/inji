import {
  CredentialSubject,
  VerifiableCredential,
} from '../../../types/VC/ExistingMosipVC/vc';
import VerifiedIcon from '../../VerifiedIcon';
import i18n, {getLocalizedField} from '../../../i18n';
import {Row} from '../../ui';
import {VCItemField} from './VCItemField';
import React from 'react';
import {format, parse} from 'date-fns';
import {logoType} from '../../../machines/issuersMachine';
import {Image} from 'react-native';
import {Theme} from '../../ui/styleUtils';

export const getFieldValue = (
  verifiableCredential: VerifiableCredential,
  field: string,
) => {
  switch (field) {
    case 'status':
      return <VerifiedIcon />;
    case 'idType':
      return i18n.t('VcDetails:nationalCard');
    case 'dateOfBirth':
      return formattedDateOfBirth(verifiableCredential);
    case 'address':
      return getLocalizedField(
        getFullAddress(verifiableCredential?.credentialSubject),
      );
    default:
      return getLocalizedField(verifiableCredential?.credentialSubject[field]);
  }
};

export const getFieldName = (field: string, wellknown: any) => {
  if (wellknown && wellknown.credentials_supported) {
    const fieldObj =
      wellknown.credentials_supported[0].credential_definition
        .credentialSubject[field];
    if (fieldObj) {
      const newFieldObj = fieldObj.display.map(obj => {
        return {language: obj.locale, value: obj.name};
      });
      return getLocalizedField(newFieldObj);
    }
  }
  return i18n.t(`VcDetails:${field}`);
};

export const setBackgroundColour = (wellknown: any) => {
  if (wellknown && wellknown.credentials_supported[0]?.display) {
    return {
      backgroundColor:
        wellknown.credentials_supported[0].display[0].background_color,
    };
  }
};

export const setTextColor = (wellknown: any) => {
  if (wellknown && wellknown.credentials_supported[0]?.display) {
    return {
      color: wellknown.credentials_supported[0].display[0].text_color,
    };
  }
};

function getFullAddress(credential: CredentialSubject) {
  if (!credential) {
    return '';
  }

  const fields = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'province',
    'region',
  ];

  return fields
    .map(field => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}

function formattedDateOfBirth(verifiableCredential: any) {
  const dateOfBirth = verifiableCredential?.credentialSubject.dateOfBirth;
  if (dateOfBirth) {
    const formatString =
      dateOfBirth.split('/').length === 1 ? 'yyyy' : 'yyyy/MM/dd';
    const parsedDate = parse(dateOfBirth, formatString, new Date());
    return format(parsedDate, 'MM/dd/yyyy');
  }
  return dateOfBirth;
}

export const fieldItemIterator = (
  fields: any[],
  verifiableCredential: any,
  wellknown: any,
) => {
  return fields.map(field => {
    const fieldName = getFieldName(field, wellknown);
    const fieldValue = getFieldValue(verifiableCredential, field);
    if (!fieldValue) return;
    return (
      <Row
        style={{flexDirection: 'row', flex: 1}}
        align="space-between"
        let
        margin="0 8 5 8">
        <VCItemField
          key={field}
          fieldName={fieldName}
          fieldValue={fieldValue}
          verifiableCredential={verifiableCredential}
          wellknown={wellknown}
        />
      </Row>
    );
  });
};

export const isVCLoaded = (verifiableCredential: any, fields: string[]) => {
  return verifiableCredential != null && fields.length > 0;
};

export const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: logoType) => {
  if (isOpenId4VCI) {
    return (
      <Image
        source={{uri: issuerLogo?.url}}
        alt={issuerLogo?.alt_text}
        style={Theme.Styles.issuerLogo}
        resizeMethod="scale"
        resizeMode="contain"
      />
    );
  }
  return (
    <Image
      source={Theme.MosipSplashLogo}
      style={Theme.Styles.logo}
      resizeMethod="scale"
      resizeMode="contain"
    />
  );
};
