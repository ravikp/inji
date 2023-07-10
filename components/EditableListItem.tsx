import React, { useEffect, useState } from 'react';
import { Dimensions, I18nManager } from 'react-native';
import { Icon, ListItem, Overlay, Input } from 'react-native-elements';
import { Text, Column, Row, Button } from './ui';
import { Theme } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

export const EditableListItem: React.FC<EditableListItemProps> = (props) => {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.value);
  const [overlayOpened, setOverlayOpened] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (props.credentialRegistryResponse === 'success') {
      closePopup();
    }
    props.verifiable && setIsVerifying(false);
  }, [props.credentialRegistryResponse]);

  return (
    <ListItem
      bottomDivider
      topDivider
      onPress={() => {
        setIsEditing(true);
        props.reset && props.reset();
      }}>
      <Icon
        name={props.Icon}
        containerStyle={Theme.Styles.settingsIconBg}
        type={props.IconType}
        size={25}
        color={Theme.Colors.Icon}
      />
      <ListItem.Content>
        <ListItem.Title>
          <Text weight="semibold" color={Theme.Colors.profileLabel}>
            {props.label}
          </Text>
        </ListItem.Title>
        <Text color={Theme.Colors.profileValue}>{props.value}</Text>
      </ListItem.Content>
      <Icon
        name="chevron-right"
        size={21}
        color={Theme.Colors.profileLanguageValue}
      />
      <Overlay
        overlayStyle={{ padding: 24, elevation: 6 }}
        isVisible={isEditing}
        onBackdropPress={dismiss}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          <Text>{t('editLabel', { label: props.label })}</Text>
          <Input
            autoFocus
            value={newValue}
            onChangeText={setNewValue}
            selectionColor={Theme.Colors.Cursor}
            inputStyle={{
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
          />
          {props.credentialRegistryResponse === 'error' && (
            <Text style={Theme.TextStyles.error}>
              please try again after sometime...
            </Text>
          )}
          {props.credentialRegistryResponse === 'success' &&
            overlayOpened &&
            closePopup()}
          <Row>
            <Button fill type="clear" title={t('cancel')} onPress={dismiss} />
            <Button
              fill
              title={t('save')}
              onPress={edit}
              loading={isVerifying}
            />
          </Row>
        </Column>
      </Overlay>
    </ListItem>
  );

  function edit() {
    props.verifiable && setIsVerifying(true);
    props.onEdit(newValue);
    if (props.credentialRegistryResponse === undefined) {
      setIsEditing(false);
    }
  }

  function dismiss() {
    props.verifiable && setIsVerifying(false);
    setNewValue(props.value);
    setIsEditing(false);
    props.credentialRegistryResponse = '';
  }

  function closePopup() {
    props.verifiable && setIsVerifying(false);
    setIsEditing(false);
    setOverlayOpened(false);
  }
};

interface EditableListItemProps {
  label: string;
  value: string;
  Icon: string;
  IconType?: string;
  onEdit: (newValue: string) => void;
  display?: 'none' | 'flex';
  credentialRegistryResponse: string;
  verifiable?: boolean;
  reset?: () => void;
}
