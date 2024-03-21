module.exports = function (api) {
  const isNotInDebugMode = api.env() !== 'development';

  api.cache(true);
  const plugins = [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: 'react-native-dotenv',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.md'],
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          'isomorphic-webcrypto': 'isomorphic-webcrypto/src/react-native',
          'fast-text-encoding': 'fast-text-encoding/text',
          jsonld: '@digitalcredentials/jsonld',
          'jsonld-signatures': '@digitalcredentials/jsonld-signatures',
        },
      },
    ],
  ];
  if (isNotInDebugMode) {
    plugins.push(['transform-remove-console', {exclude: ['error', 'warn']}]);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
