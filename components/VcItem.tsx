import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable } from 'react-native';
import { ActorRefFrom } from 'xstate';
import {
  createVcItemMachine,
  selectVerifiableCredential,
  selectGeneratedOn,
  vcItemMachine,
  selectContext,
  selectTag,
  selectEmptyWalletBindingId,
  selectIsSavingFailedInIdle,
  selectKebabPopUp,
} from '../machines/vcItem';
import { VcItemEvents } from '../machines/vcItem';
import { ErrorMessageOverlay } from './MessageOverlay';
import { Theme } from './ui/styleUtils';
import { GlobalContext } from '../shared/GlobalContext';
import { VcItemContent } from './VcItemContent';
import { VcItemActivationStatus } from './VcItemActivationStatus';
import { Row } from './ui';
import { KebabPopUp } from './KebabPopUp';
import { logState } from '../machines/app';

export const VcItem: React.FC<VcItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );

  const service = useInterpret(machine.current, { devTools: __DEV__ });
  service.subscribe(logState);
  const context = useSelector(service, selectContext);
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const DISMISS = () => service.send(VcItemEvents.DISMISS());
  const KEBAB_POPUP = () => service.send(VcItemEvents.KEBAB_POPUP());
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);

  const storeErrorTranslationPath = 'errors.savingFailed';

  const generatedOn = useSelector(service, selectGeneratedOn);
  const tag = useSelector(service, selectTag);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => props.onPress(service)}
        disabled={!verifiableCredential}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <VcItemContent
          context={context}
          verifiableCredential={verifiableCredential}
          generatedOn={generatedOn}
          tag={tag}
          selectable={props.selectable}
          selected={props.selected}
          service={service}
          iconName={props.iconName}
          iconType={props.iconType}
          onPress={() => props.onPress(service)}
        />
        {props.isSharingVc ? null : (
          <Row crossAlign="center">
            {props.activeTab !== 'receivedVcsTab' &&
              props.activeTab != 'sharingVcScreen' && (
                <VcItemActivationStatus
                  verifiableCredential={verifiableCredential}
                  emptyWalletBindingId={emptyWalletBindingId}
                  onPress={() => props.onPress(service)}
                  showOnlyBindedVc={props.showOnlyBindedVc}
                />
              )}
            <Pressable onPress={KEBAB_POPUP}>
              <KebabPopUp
                testID="ellipsis"
                vcKey={props.vcKey}
                iconName="dots-three-horizontal"
                iconType="entypo"
                isVisible={isKebabPopUp}
                onDismiss={DISMISS}
                service={service}
              />
            </Pressable>
          </Row>
        )}
      </Pressable>
      <ErrorMessageOverlay
        isVisible={isSavingFailedInIdle}
        error={storeErrorTranslationPath}
        onDismiss={DISMISS}
        translationPath={'VcDetails'}
      />
    </React.Fragment>
  );
};

interface VcItemProps {
  vcKey: string;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  activeTab?: string;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
}
