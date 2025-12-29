// Initialize Firebase app using web SDK v9
import { initializeApp, getApps } from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0uWfb8pwdCRki6N5JDH3MoAlBafxKmFQ",
  authDomain: "napp-5b6cd.firebaseapp.com",
  databaseURL: "https://napp-5b6cd.firebaseio.com",
  projectId: "napp-5b6cd",
  storageBucket: "napp-5b6cd.firebasestorage.app",
  messagingSenderId: "496866331875",
  appId: "1:496866331875:android:f0d4fccabdc050893c49d6"
};

let app;

export async function ensureFirebaseInitialized() {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized with web SDK');
    } else {
      app = getApps()[0];
      console.log('Firebase app already initialized');
    }
    return true;
  } catch (e) {
    console.error('Firebase initialization failed:', e);
    throw new Error('Firebase initialization failed: ' + e.message);
  }
}

export { app };
