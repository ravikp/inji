const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '\\.snap$'],
  cacheDirectory: '.jest/cache',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    __DEV__: true,
  },
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // TODO: Remove this to log the type mismatch errors later.
        diagnostics: {
          exclude: ['**'],
        },
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  // This line should be kept even with nothing to be ignored, otherwise the transform will not take place.
  // Not quite sure about the reason.
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    'node_modules/(?!(@react-native|react-native|react-native-argon2|@react-navigation|react-native-elements|react-native-size-matters|react-native-ratings|expo-constants|base58-universal|@react-native-*|react-native-google-signin|react-native-linear-gradient|expo-camera|base58-universal/*|react-native-*)/).*/',
  ],
  setupFiles: [
    '<rootDir>/__mocks__/jest-init.js',
    '<rootDir>/__mocks__/mmkv-db-setup.js',
    '<rootDir>/__mocks__/react-native.mock.js',
    '<rootDir>/__mocks__/expo-constants.mock.js',
    '<rootDir>/node_modules/react-native-mmkv-storage/jest/mmkvJestSetup.js',
    '<rootDir>/node_modules/@react-native-community/netinfo/jest/netinfo-mock.js',
    '<rootDir>/__mocks__/react-native-argon2.mock.js',
    // https://github.com/react-native-google-signin/google-signin?tab=readme-ov-file#jest-module-mock
    '<rootDir>/node_modules/@react-native-google-signin/google-signin/jest/build/setup.js',
  ],
  // TODO: enable this to also collect coverage
  collectCoverage: false,
  collectCoverageFrom: [
    'routes/*.ts',
    'screens/**',
    'machines/**',
    'lib/jsonld-signatures/**',
    'components/**',
    'machines/**',
    'shared/**',
    '**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    // https://stackoverflow.com/a/54513338
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^\\.\\/locales\\/en\\.json$': '<rootDir>/__mocks__/en.mock.json',
    '^@digitalbazaar/rsa-verification-key-2018$':
      '<rootDir>/__mocks__/rsa-verification-key-2018.js',
    '^react-native-biometrics-changed$':
      '<rootDir>/__mocks__/react-native-biometrics-changed.js',
  },
};
