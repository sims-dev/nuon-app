import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

let initialized = false;

function initFirebaseAdmin(): typeof admin {
  if (initialized) return admin;

  try {
    // Try to initialize with service account file
    const serviceAccountPath = path.resolve(__dirname, 'service-account-key.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log('Firebase Admin initialized with service account file');
      return admin;
    }

    // Try to initialize with environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log('Firebase Admin initialized with environment variable');
      return admin;
    }

    // Try default initialization
    admin.initializeApp();
    initialized = true;
    console.log('Firebase Admin initialized with default credentials');
    return admin;
  } catch (err) {
    console.warn('Firebase Admin initialization failed:', (err as Error).message);
    // Return a stub that throws errors
    return {
      auth: () => ({
        verifyIdToken: async () => {
          throw new Error('Firebase admin unavailable');
        }
      })
    } as any;
  }
}

export const firebaseAdmin = initFirebaseAdmin();