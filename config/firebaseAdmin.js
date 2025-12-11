// Firebase admin integration intentionally stubbed/disabled
// The original project used `firebase-admin`. To disable Firebase in this fork
// we provide a small stub that keeps the same shape for `auth().verifyIdToken`
// so server code can still require this module without crashing. When Firebase
// is required, set env var ENABLE_FIREBASE_ADMIN=true and provide credentials.

/*
  Original behaviour (commented out):
  const admin = require('firebase-admin');
  // initialization logic using credentials
  module.exports = initFirebaseAdmin();

  For now we export a minimal stub that throws on verify when Firebase is not enabled.
*/

if (process.env.ENABLE_FIREBASE_ADMIN === 'true') {
  // Lazy-require the real firebase-admin only when explicitly enabled.
  try {
    const admin = require('firebase-admin');
    const fs = require('fs');

    let initialized = false;
    function initFirebaseAdmin() {
      if (initialized) return admin;
      const logger = require('../lib/logger');
      try {
          if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
            admin.initializeApp({
              credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS))
            });
            initialized = true;
            return admin;
          }

          if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount)
            });
            initialized = true;
            return admin;
          }
        } catch (err) {
          logger.warn('Firebase Admin initialization failed:', err.message);
        }

      try {
        admin.initializeApp();
        initialized = true;
      } catch (err) {
        // ignore
      }

      return admin;
    }

    module.exports = initFirebaseAdmin();
  } catch (err) {
    // If requiring firebase-admin fails, fall back to the stub below
    module.exports = {
      auth() {
        return {
          verifyIdToken: async () => { throw new Error('Firebase admin unavailable'); }
        };
      }
    };
  }

} else {
  // Stubbed firebase admin (disabled). Calls to verifyIdToken will reject,
  // and server code should handle failing verification and fall back to legacy auth.
  module.exports = {
    auth() {
      return {
        verifyIdToken: async (/* token */) => {
          // Keep the same async API but reject to signal Firebase is not available.
          throw new Error('Firebase admin disabled in this deployment');
        }
      };
    }
  };
}

// Firebase admin is disabled by default to avoid requiring service account keys
// Set ENABLE_FIREBASE_ADMIN=true in environment to enable Firebase admin features

const enabled = process.env.ENABLE_FIREBASE_ADMIN === 'true';

if (enabled) {
  const admin = require('firebase-admin');
  const path = require('path');

  // Resolve the path to the service account key dynamically
  const serviceAccountPath = path.resolve(__dirname, 'service-account-key.json');

  try {
    const serviceAccount = require(serviceAccountPath);

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const firestore = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully');

    module.exports = { admin, firestore };
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
    module.exports = {
      auth() {
        return {
          verifyIdToken: async () => { throw new Error('Firebase admin unavailable'); }
        };
      }
    };
  }
} else {
  console.log('Firebase Admin SDK disabled (set ENABLE_FIREBASE_ADMIN=true to enable)');
  module.exports = {
    auth() {
      return {
        verifyIdToken: async () => { throw new Error('Firebase admin disabled'); }
      };
    }
  };
}
