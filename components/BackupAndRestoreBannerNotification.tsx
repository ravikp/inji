import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {useTranslation} from 'react-i18next';
import {useBackupRestoreScreen} from '../screens/Settings/BackupRestoreController';

export const BackupAndRestoreBannerNotification: React.FC = () => {
  const backUpController = useBackupScreen();
  const restoreController = useBackupRestoreScreen();

  const {t} = useTranslation('BackupAndRestoreBanner');

  function backupFailure() {
    const translation = t(
      `backupFailure.${backUpController.backupErrorReason}`,
    );

    return (
      <BannerNotification
        type="error"
        message={translation}
        onClosePress={backUpController.DISMISS}
        key={`backupFailure-${backUpController.backupErrorReason}`}
        testId={`backupFailure-${backUpController.backupErrorReason}`}
      />
    );
  }

  function restoreFailure() {
    const translation = t(
      `restoreFailure.${restoreController.restoreErrorReason}`,
    );

    return (
      <BannerNotification
        type="error"
        key={`restoreFailure-${restoreController.restoreErrorReason}`}
        message={translation}
        onClosePress={restoreController.DISMISS}
        testId={`restoreFailure-${restoreController.restoreErrorReason}`}
      />
    );
  }

  return (
    <>
      {backUpController.isBackingUpSuccess && (
        <BannerNotification
          type="success"
          message={t('backupSuccessful')}
          onClosePress={backUpController.DISMISS}
          key={'dataBackupSuccess'}
          testId={'dataBackupSuccess'}
        />
      )}

      {backUpController.isBackingUpFailure &&
        !backUpController.fetchDataFromDB &&
        backupFailure()}

      {restoreController.isBackUpRestoreSuccess && (
        <BannerNotification
          type="success"
          message={t('restoreSuccessful')}
          onClosePress={restoreController.DISMISS}
          key={'restoreBackupSuccess'}
          testId={'restoreBackupSuccess'}
        />
      )}
      {restoreController.isBackUpRestoreFailure &&
        !restoreController.isDownloadBackupFileFromCloud &&
        restoreFailure()}
    </>
  );
};
