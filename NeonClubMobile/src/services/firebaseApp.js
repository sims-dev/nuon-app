// Ensure @react-native-firebase/app default app exists before using auth()
// NOTE: React Native Firebase auto-initializes the DEFAULT app from native
// google-services.json (Android) / GoogleService-Info.plist (iOS). We should
// NOT call initializeApp() without options, as that will throw an apiKey error.
import firebase from '@react-native-firebase/app';

export async function ensureFirebaseInitialized() {
  try {
    // If default app is available, this will return it.
    const app = firebase.app();
    // Additional sanity: ensure at least one app is registered
    if (!app && (!firebase.apps || firebase.apps.length === 0)) {
      throw new Error('No Firebase app instances registered');
    }
    return true;
  } catch (e) {
    // Provide a helpful error so the caller can show a clear message
    const detail = e?.message ? `\nDetail: ${e.message}` : '';
    throw new Error(
      'Firebase DEFAULT app not found. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is added and rebuild the app.' +
        detail
    );
  }
}
