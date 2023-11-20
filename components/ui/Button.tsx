import React from 'react';
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from 'react-native-elements';
import {GestureResponderEvent, StyleProp, ViewStyle} from 'react-native';
import {Text} from './Text';
import {Theme, Spacing} from './styleUtils';
import testIDProps from '../../shared/commonUtil';

export const Button: React.FC<ButtonProps> = props => {
  const type =
    props.type || 'solid' || 'radius' || 'gradient' || 'clearAddIdBtnBg';
  const buttonStyle: StyleProp<ViewStyle> = [
    props.fill ? Theme.ButtonStyles.fill : null,
    Theme.ButtonStyles[type],
    {width: props.width ?? '100%'},
  ];
  const containerStyle: StyleProp<ViewStyle> = [
    !(type === 'gradient') ? Theme.ButtonStyles.container : null,
    props.disabled ? Theme.ButtonStyles.disabled : null,
    props.margin ? Theme.spacing('margin', props.margin) : null,
    type === 'gradient'
      ? props.isVcThere
        ? Theme.ButtonStyles.float
        : Theme.ButtonStyles.gradient
      : null,
    props.styles,
  ];
  const handleOnPress = (event: GestureResponderEvent) => {
    if (!props.disabled && props.onPress) {
      props.onPress(event);
    }
  };

  return !(type === 'gradient') ? (
    <RNEButton
      {...testIDProps(props.testID)}
      buttonStyle={buttonStyle}
      containerStyle={[
        props.fill ? Theme.ButtonStyles.fill : null,
        containerStyle,
      ]}
      type={props.type}
      raised={props.raised}
      title={
        <Text
          style={{paddingTop: 3}}
          weight="semibold"
          align="center"
          color={
            type === 'solid' || type === 'addId' || type === 'radius'
              ? Theme.Colors.whiteText
              : type === 'plain'
              ? Theme.Colors.plainText
              : Theme.Colors.AddIdBtnTxt
          }>
          {props.title}
        </Text>
      }
      style={[buttonStyle]}
      icon={props.icon}
      onPress={handleOnPress}
      loading={props.loading}
    />
  ) : (
    <RNEButton
      {...testIDProps(props.testID)}
      buttonStyle={buttonStyle}
      ViewComponent={require('react-native-linear-gradient').default}
      linearGradientProps={{
        colors: !props.disabled
          ? Theme.Colors.GradientColors
          : Theme.Colors.DisabledColors,
      }}
      containerStyle={containerStyle}
      type={props.type}
      raised={props.raised}
      title={
        <Text
          style={{...Theme.TextStyles.bold, paddingTop: 3}}
          color={
            type === 'solid' || type === 'gradient' || type === 'radius'
              ? Theme.Colors.whiteText
              : Theme.Colors.DownloadIdBtnTxt
          }>
          {props.title}
        </Text>
      }
      style={[buttonStyle]}
      icon={props.icon}
      onPress={handleOnPress}
      loading={props.loading}
    />
  );
};

interface ButtonProps {
  testID?: string;
  title: string;
  disabled?: boolean;
  margin?: Spacing;
  type?: RNEButtonProps['type'] | 'gradient';
  isVcThere?: boolean;
  onPress?: RNEButtonProps['onPress'];
  fill?: boolean;
  raised?: boolean;
  loading?: boolean;
  icon?: RNEButtonProps['icon'];
  styles?: StyleProp<ViewStyle>;
  colors?: (string | number)[];
  width?: number;
}
