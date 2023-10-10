import React from 'react';
import {View} from 'react-native';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {Icon} from 'react-native-elements';
import testIDProps from '../shared/commonUtil';

export const BannerNotification: React.FC<BannerNotificationProps> = props => {
  return (
    <View {...testIDProps(props.testId)}>
      <Row style={Theme.Styles.downloadingVcPopUp}>
        <Text color={Theme.Colors.whiteText} weight="semibold" size="smaller">
          {props.message}
        </Text>
        <Icon
          testID="close"
          name="close"
          onPress={props.onClosePress}
          color={Theme.Colors.whiteText}
          size={19}
        />
      </Row>
    </View>
  );
};

export interface BannerNotificationProps {
  message: string;
  onClosePress: () => void;
  testId: string;
}
