import React from 'react';
import {useTranslation} from 'react-i18next';
import {RefreshControl} from 'react-native';
import {Centered, Column, Text} from '../../components/ui';
import {Icon} from 'react-native-elements';
import {Theme} from '../../components/ui/styleUtils';
import {Modal} from '../../components/ui/Modal';
import {ViewVcModal} from '../Home/ViewVcModal';
import {VcItemContainer} from '../../components/VC/VcItemContainer';

export const ReceivedCardsModal: React.FC<ReceivedCardsProps> = ({
  isVisible,
  controller,
  onDismiss,
}) => {
  const {t} = useTranslation('ReceivedVcsTab');
  return (
    <Modal
      isVisible={isVisible}
      arrowLeft={<Icon name={''} />}
      headerTitle={t('header')}
      headerElevation={2}
      onDismiss={onDismiss}>
      <Column
        scroll
        pX={15}
        refreshControl={
          <RefreshControl
            refreshing={controller.isRefreshingVcs}
            onRefresh={controller.REFRESH}
          />
        }>
        {controller.receivedVcsMetadata.map(vcMetadata => (
          <VcItemContainer
            key={vcMetadata.getVcKey()}
            vcMetadata={vcMetadata}
            margin="0 2 8 2"
            isSharingVc
            onPress={controller.VIEW_VC}
          />
        ))}
        {controller.receivedVcsMetadata.length === 0 && (
          <React.Fragment>
            <Centered fill>
              <Icon
                style={{marginBottom: 20}}
                size={40}
                name="sentiment-dissatisfied"
              />
              <Text
                testID="noReceivedVcsTitle"
                align="center"
                weight="semibold"
                margin="0 0 4 0">
                {t('noReceivedVcsTitle')}
              </Text>
              <Text
                testID="noReceivedVcsText"
                align="center"
                color={Theme.Colors.textLabel}>
                {t('noReceivedVcsText')}
              </Text>
            </Centered>
          </React.Fragment>
        )}
      </Column>
      {controller.selectedVc && (
        <ViewVcModal
          isVisible={controller.isViewingVc}
          onDismiss={controller.DISMISS_MODAL}
          vcItemActor={controller.selectedVc}
          onRevokeDelete={() => {
            controller.REVOKE();
          }}
          activeTab={controller.activeTab}
        />
      )}
    </Modal>
  );
};

export interface ReceivedCardsProps {
  isVisible: boolean;
  controller: any;
  onDismiss: () => void;
}
