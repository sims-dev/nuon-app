const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    nodeModulesPaths: [require('path').resolve(__dirname, 'node_modules')],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: process.env.NODE_ENV === 'production' ? false : true,
      },
    }),
    // Disable Fast Refresh in production to prevent runtime errors
    unstable_disableFastRefresh: process.env.NODE_ENV === 'production',
  },
  // Ensure production builds don't include development code
  serializer: {
    getModulesRunBeforeMainModule: () => {
      if (process.env.NODE_ENV === 'production') {
        return [];
      }
      return [
        require.resolve('@react-native-async-storage/async-storage'),
        require.resolve('react-native-gesture-handler'),
      ];
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
