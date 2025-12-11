// Centralized configuration for IP address

// Use React Native Platform API for mobile detection
const MOBILE_IP = '192.168.0.209'; // LAN IP for mobile devices
const WEB_IP = 'localhost';

export function getIpAddress() {
  try {
    // Dynamically require Platform only if available
    const Platform = require('react-native').Platform;
    if (Platform && (Platform.OS === 'android' || Platform.OS === 'ios')) {
      return MOBILE_IP;
    }
  } catch (e) {}
  // Default to localhost for web
  return WEB_IP;
}

export const IP_ADDRESS = getIpAddress();