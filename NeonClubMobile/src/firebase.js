// React Native Firebase auth binding
// Ensure the default Firebase app is registered before accessing auth()
try {
  // eslint-disable-next-line global-require
  require('@react-native-firebase/app');
} catch (e) {
  // Will be handled by stub below if native module is missing
}
// Prefer the real @react-native-firebase/auth if available, otherwise fall back to a no-op stub.
let auth = null;
try {
  // eslint-disable-next-line global-require
  auth = require('@react-native-firebase/auth').default;
  // No explicit initializeApp is needed; native layer initializes from google-services.json
} catch (err) {
  console.warn('[firebase] RN Firebase auth not available, using stub:', err?.message);
  auth = () => ({
    currentUser: null,
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    signInWithPhoneNumber: async () => { throw new Error('Firebase auth unavailable'); },
    signOut: async () => {},
  });
}

export { auth };
