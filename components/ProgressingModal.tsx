import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Centered, Column, Text} from './ui';
import {Modal} from './ui/Modal';
import {Image} from 'react-native';
import {Theme} from './ui/styleUtils';
import PaginationDot from 'react-native-animated-pagination-dot';

/*
 * Loader component exists with an animating loader in screens/Issuers/Loader.tsx.
 * This loader is used in IssuersScreen and can be used further for other loading scenarios to maintain consistency
 */

export const ProgressingModal: React.FC<ProgressingModalProps> = props => {
  const {t} = useTranslation('ScanScreen');

  let n = 0;
  const [curPage, setCurPage] = useState(n);

  const highLightDot = () => setCurPage(n + 1);

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerLeft={t(props.title)}
        onDismiss={props.onCancel}
        headerLabel={props.label}
        headerElevation={3}
        requester={props.requester}>
        <Centered crossAlign="center" fill>
          <Column margin="24 0" align="space-around">
            <Image
              source={Theme.InjiProgressingLogo}
              height={2}
              width={2}
              style={{marginBottom: 15, marginLeft: -6}}
            />
            {props.progress && (
              <PaginationDot
                activeDotColor={Theme.Colors.LoadingDetailsLabel}
                curPage={curPage}
                maxPage={3}
              />
            )}
          </Column>
          {props.isHintVisible && (
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
        </Centered>
      </Modal>
    </React.Fragment>
  );
};

export interface ProgressingModalProps {
  isVisible: boolean;
  isHintVisible: boolean;
  title?: string;
  label?: string;
  hint?: string;
  onCancel?: () => void;
  onStayInProgress?: () => void;
  onRetry?: () => void;
  requester?: boolean;
  progress?: boolean | number;
}
