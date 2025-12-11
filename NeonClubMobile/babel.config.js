module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    // Only include reanimated plugin in development
    ...(process.env.NODE_ENV !== 'production' ? ['react-native-reanimated/plugin'] : []),
  ],
};
