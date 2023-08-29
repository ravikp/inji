import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { useIssuerScreenController } from './IssuerScreenController';
import { Column } from '../../components/ui';
import { Issuer } from '../../components/Issuer/Issuer';
import { ErrorModal } from '../../components/ui/ErrorModal';
import { Theme } from '../../components/ui/styleUtils';
import { HomeRouteProps } from '../../routes/main';
import { ProgressingModal } from '../../components/ProgressingModal';

export const IssuersScreen: React.FC<HomeRouteProps> = (props) => {
  const controller = useIssuerScreenController(props);
  const { t } = useTranslation('IssuersScreen');

  const onPressHandler = (id) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
  };

  const isGenericError = () => {
    return controller.errorMessage === 'generic';
  };

  const goBack = () => {
    controller.RESET_ERROR();
    setTimeout(() => {
      props.navigation.goBack();
    }, 0);
  };

  const getImage = () => {
    if (isGenericError()) {
      return (
        <Image
          source={Theme.SomethingWentWrong}
          style={{ width: 370, height: 150 }}
        />
      );
    }
    return <Image source={Theme.NoInternetConnection} />;
  };

  return (
    <React.Fragment>
      <Column style={Theme.Styles.issuerListOuterContainer}>
        <Text>{t('header')}</Text>
        {controller.issuers.length > 0 && (
          <FlatList
            data={controller.issuers}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Issuer
                id={item.id}
                description={item.displayName}
                onPress={() => onPressHandler(item.id)}
                {...props}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => item.id}
          />
        )}
      </Column>
      {controller.errorMessage && (
        <ErrorModal
          isVisible={controller.errorMessage !== null}
          title={t(`errors.${controller.errorMessage}.title`)}
          message={t(`errors.${controller.errorMessage}.message`)}
          goBack={goBack}
          tryAgain={isGenericError() ? null : controller.TRY_AGAIN}
          image={getImage()}
        />
      )}
      {controller.isDownloadingCredentials && (
        <ProgressingModal
          isVisible={controller.isDownloadingCredentials}
          title={t('modal.title')}
          onCancel={controller.CANCEL}
          hint={t('modal.hint')}
          progress={true}
        />
      )}
    </React.Fragment>
  );
};
