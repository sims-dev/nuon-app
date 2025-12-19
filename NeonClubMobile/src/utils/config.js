// Configuration file for the app
import { Platform, NativeModules } from 'react-native';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
// Compute a single, environment-aware dev base once at startup (no switching later).
// - Android emulator: 10.0.2.2 maps to host machine
// - Physical device: derive the Metro host IP from scriptURL (e.g., 192.168.x.x)
// - iOS simulator/mac: localhost
let derivedHost = null;
try {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    // e.g. http://10.0.2.2:8081/index.bundle or http://192.168.x.x:8081/index.bundle
    derivedHost = scriptURL.split('://')[1].split(':')[0];
  }
} catch {}

// Import centralized IP configuration
const { IP_ADDRESS } = require('../config/ipConfig');

console.log('Resolved IP_ADDRESS:', IP_ADDRESS);

// Use centralized IP_ADDRESS (should point to your machine LAN IP) for dev builds
// Ensure the mobile app talks to the backend on port 5000 and uses the /api prefix
let DEV_BASE = __DEV__ ? (ENV_API_BASE_URL || `http://${IP_ADDRESS}:5000/api`) : 'https://your-production-api.com/api';

export const CONFIG = {
  // For dev, always use the LAN IP above. For production, use your deployed API URL.
  API_BASE_URL: __DEV__ ? DEV_BASE : 'https://your-app.herokuapp.com/api',
  // Lower default timeout to make the app feel more responsive on bad networks
  // Keep individual flows (like OTP/profile) even snappier via per-request overrides
  TIMEOUT: 8000,
  RAZORPAY_KEY: 'your_razorpay_key_here',
  STRIPE_KEY: 'your_stripe_key_here',
  // OTP provider settings
  OTP_PROVIDER: 'backend', // Always use backend for OTP in all environments
  TWO_FACTOR_API_KEY: 'XXXX-XXXX-XXXX-XXXX-XXXX', // replace with your key
  // Dummy OTP for testing (will be overridden in production)
  DUMMY_OTP: '123456',
};

export default CONFIG;
// Emulator/simulator hint (informational only)
export const IS_EMULATOR_HOST = Platform.OS === 'android' && (derivedHost === '10.0.2.2' || derivedHost === 'localhost');
export const DEV_BASE_LAN = null;
