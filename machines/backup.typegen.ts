// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]': {
      type: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backup.backingUp.zipBackupFile:invocation[0]': {
      type: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.backup.backingUp.zipBackupFile:invocation[0]': {
      type: 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkStorageAvailability: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    writeDataToFile: 'done.invoke.backup.backingUp.writeDataToFile:invocation[0]';
    zipBackupFile: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    fetchAllDataFromDB: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    sendDataBackupFailureEvent:
      | 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
    sendDataBackupStartEvent: 'FETCH_DATA';
    sendDataBackupSuccessEvent: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
    setDataFromStorage: 'STORE_RESPONSE';
    setFileName: 'FILE_NAME';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isMinimumStorageRequiredForBackupReached: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
  };
  eventsCausingServices: {
    checkStorageAvailability: 'FETCH_DATA';
    writeDataToFile: 'STORE_RESPONSE';
    zipBackupFile: 'FILE_NAME';
  };
  matchesStates:
    | 'backingUp'
    | 'backingUp.checkStorageAvailability'
    | 'backingUp.failure'
    | 'backingUp.fetchDataFromDB'
    | 'backingUp.idle'
    | 'backingUp.success'
    | 'backingUp.writeDataToFile'
    | 'backingUp.zipBackupFile'
    | 'init'
    | {
        backingUp?:
          | 'checkStorageAvailability'
          | 'failure'
          | 'fetchDataFromDB'
          | 'idle'
          | 'success'
          | 'writeDataToFile'
          | 'zipBackupFile';
      };
  tags: never;
}
