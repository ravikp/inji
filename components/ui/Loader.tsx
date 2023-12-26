import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, SafeAreaView, View} from 'react-native';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {Theme} from './styleUtils';
import {ActivityIndicator} from './ActivityIndicator';

export const Loader: React.FC<LoaderProps> = props => {
  const {t} = useTranslation('ScanScreen');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <Fragment>
      <Row style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}>
        <SafeAreaView style={Theme.ModalStyles.header}>
          <Row
            fill
            align={'flex-start'}
            style={Theme.LoaderStyles.titleContainer}>
            <View style={Theme.LoaderStyles.heading}>
              <Text
                style={Theme.TextStyles.semiBoldHeader}
                testID="loaderTitle">
                {props.title}
              </Text>
              {props.subTitle && (
                <Text
                  style={Theme.TextStyles.subHeader}
                  color={Theme.Colors.textLabel}
                  testID="loaderSubTitle">
                  {props.subTitle}
                </Text>
              )}
            </View>
          </Row>
        </SafeAreaView>
      </Row>
      <View style={Theme.Styles.hrLineFill}></View>
      <Centered
        style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}
        crossAlign="center"
        fill>
        <ActivityIndicator />
        {(props.isHintVisible || props.isBleErrorVisible) && (
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            <Text
              align="center"
              margin="10"
              color={Theme.Colors.TimoutHintText}
              size="small"
              style={Theme.TextStyles.bold}>
              {props.hint}
            </Text>
            {props.onStayInProgress && (
              <Button
                type="clear"
                title={t('status.stayOnTheScreen')}
                onPress={props.onStayInProgress}
              />
            )}

            {props.onRetry && (
              <Button
                type="clear"
                title={t('status.retry')}
                onPress={props.onRetry}
              />
            )}
          </Column>
        )}
        <Column style={{display: props.hint ? 'flex' : 'none'}}>
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            <Text
              align="center"
              color={Theme.Colors.TimoutText}
              style={Theme.TextStyles.bold}>
              {props.hint}
            </Text>
            {props.onCancel && (
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={props.onCancel}
              />
            )}
          </Column>
        </Column>
      </Centered>
    </Fragment>
  );
};

export interface LoaderProps {
  title: string;
  subTitle?: string;
  label?: string;
  hint?: string;
  onStayInProgress?: () => void;
  isHintVisible?: boolean;
  isBleErrorVisible?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  requester?: boolean;
  progress?: boolean | number;
  onBackdropPress?: () => void;
}
