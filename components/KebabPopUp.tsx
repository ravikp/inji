import React from 'react';
import {Icon, ListItem, Overlay} from 'react-native-elements';
import {Theme} from '../components/ui/styleUtils';
import {Column, Row, Text} from '../components/ui';
import {View} from 'react-native';
import {useKebabPopUp} from './KebabPopUpController';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import {VCMetadata} from '../shared/VCMetadata';
import testIDProps from '../shared/commonUtil';
import {getKebabMenuOptions} from './kebabMenuUtils';

export const KebabPopUp: React.FC<KebabPopUpProps> = props => {
  const controller = useKebabPopUp(props);
  const {t} = useTranslation('HomeScreenKebabPopUp');

  return (
    <Column>
      {props.icon ? (
        props.icon
      ) : (
        <Icon
          {...testIDProps('ellipsis')}
          accessible={true}
          name={props.iconName}
          type={props.iconType}
          {...(props.iconColor ? props.iconColor : Theme.Colors.helpText)}
          size={Theme.ICON_SMALL_SIZE}
        />
      )}
      <Overlay
        isVisible={props.isVisible && !controller.isScanning}
        onBackdropPress={props.onDismiss}
        overlayStyle={Theme.KebabPopUpStyles.kebabPopUp}>
        <Row
          style={Theme.KebabPopUpStyles.kebabHeaderStyle}
          margin="15"
          crossAlign="center">
          <Text testID="kebabTitle" weight="bold">
            {t('title')}
          </Text>
          <Icon
            {...testIDProps('close')}
            name="close"
            onPress={props.onDismiss}
            color={Theme.Colors.Details}
            size={25}
          />
        </Row>

        <FlatList
          data={getKebabMenuOptions(props)}
          renderItem={({item}) => (
            <ListItem topDivider onPress={item.onPress}>
              <Row crossAlign="center" style={{flex: 1}}>
                <View style={{width: 25, alignItems: 'center'}}>
                  {item.icon}
                </View>
                <Text
                  style={{fontFamily: 'Inter_600SemiBold'}}
                  color={
                    item.testID === 'removeFromWallet'
                      ? Theme.Colors.warningText
                      : undefined
                  }
                  margin="0 0 0 10">
                  {item.label}
                </Text>
              </Row>
            </ListItem>
          )}
        />
      </Overlay>
    </Column>
  );
};

export interface KebabPopUpProps {
  iconName: string;
  iconType?: string;
  vcMetadata: VCMetadata;
  isVisible?: boolean;
  onDismiss: () => void;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
  iconColor?: any;
  icon?: any;
  vcHasImage: boolean;
}
