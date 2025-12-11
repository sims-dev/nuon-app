/**
 * @format
 */

// Fix missing performance.now
if (!global.performance) {
  global.performance = { now: () => Date.now() };
}

import { AppRegistry } from 'react-native';

// Use correct global error handler for React Native 0.82.0
if (global.ErrorUtils && global.ErrorUtils.setGlobalHandler) {
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    // You can log the error or show a custom UI
    console.log('Global error:', error, 'Fatal:', isFatal);
  });
}

import 'react-native-gesture-handler';

import App from './App';
import { name as appName } from './app.json';

// Polyfill for window object to prevent "property window does not exist" errors
if (typeof global.window === 'undefined') {
  global.window = global;
}

AppRegistry.registerComponent(appName, () => App);
