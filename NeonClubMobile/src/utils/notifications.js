import api from '../services/api';

// Attempts to obtain an FCM token if @react-native-firebase/messaging is installed.
// No-ops safely if messaging is not present or permissions denied.
export async function registerPushTokenIfAvailable() {
  let messaging;
  try {
    // eslint-disable-next-line global-require
    messaging = require('@react-native-firebase/messaging').default;
  } catch (e) {
    return null; // package not installed or not linked
  }
  try {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) return null;
    const fcmToken = await messaging().getToken();
    if (!fcmToken) return null;
  await api.put('/profile/push-token', { fcmToken }).catch(() => {});
    return fcmToken;
  } catch (_e) {
    return null;
  }
}
