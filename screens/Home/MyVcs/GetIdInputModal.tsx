import React from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Dimensions,
  View,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {Button, Column, Row, Text} from '../../../components/ui';
import {Modal} from '../../../components/ui/Modal';
import {Theme} from '../../../components/ui/styleUtils';
import {
  GetIdInputModalProps,
  useGetIdInputModal,
} from './GetIdInputModalController';
import {useTranslation} from 'react-i18next';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {isIOS} from '../../../shared/constants';
import testIDProps from '../../../shared/commonUtil';
import {CustomTooltip} from '../../../components/ui/ToolTip';

export const GetIdInputModal: React.FC<GetIdInputModalProps> = props => {
  const {t} = useTranslation('GetIdInputModal');
  const controller = useGetIdInputModal(props);

  const inputLabel = t('enterApplicationId');

  return (
    <Modal
      testID="getIdHeader"
      onDismiss={props.onDismiss}
      isVisible={props.isVisible}
      headerTitle={t('header')}
      headerElevation={2}>
      <KeyboardAvoidingView
        style={Theme.Styles.keyboardAvoidStyle}
        behavior={isIOS() ? 'padding' : 'height'}>
        <Column>
          <Text
            testID="getIdDescription"
            margin="10"
            style={{color: Theme.Colors.GrayText}}
            weight="regular">
            {t('applicationIdLabel')}
          </Text>
          <Row crossAlign="flex-end">
            <Input
              {...testIDProps('getIdInputModalIndividualId')}
              placeholder={!controller.id ? inputLabel : ''}
              labelStyle={{
                color: controller.isInvalid
                  ? Theme.Colors.errorMessage
                  : Theme.Colors.textValue,
                textAlign: 'left',
              }}
              inputStyle={{
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              selectionColor={Theme.Colors.Cursor}
              style={Theme.Styles.placeholder}
              value={controller.id}
              keyboardType="number-pad"
              rightIcon={
                <CustomTooltip
                  testID="GetIdInputToolTip"
                  width={Dimensions.get('screen').width * 0.87}
                  height={Dimensions.get('screen').height * 0.25}
                  triggerComponent={
                    <Icon
                      {...testIDProps('GetIdToolTipInfo')}
                      name="infocirlceo"
                      type="antdesign"
                      color={Theme.Colors.tooltipIcon}
                    />
                  }
                  toolTipContent={
                    <Column>
                      <Text weight="semibold">{t('toolTipTitle')}</Text>
                      <View style={Theme.Styles.tooltipHrLine}></View>
                      <Text
                        weight="regular"
                        style={Theme.Styles.tooltipContentDescription}>
                        {t(`toolTipDescription`)}
                      </Text>
                    </Column>
                  }
                />
              }
              errorStyle={{color: Theme.Colors.errorMessage}}
              errorMessage={controller.idError}
              onChangeText={controller.INPUT_ID}
              ref={node => !controller.idInputRef && controller.READY(node)}
            />
          </Row>
        </Column>
        <Column>
          <Button
            testID="getIdButton"
            title={t('getUIN')}
            margin="24 0 0 0"
            type="gradient"
            disabled={!controller.id}
            onPress={controller.VALIDATE_INPUT}
            loading={controller.isRequestingOtp}
          />
        </Column>

        <MessageOverlay
          isVisible={controller.isRequestingOtp}
          title={t('requestingOTP')}
          progress
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};
