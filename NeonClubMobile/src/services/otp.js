// OTP helpers using Firebase web SDK v9
// Minimal wrapper so screens can import without changing existing flows

import { getAuth, signInWithPhoneNumber, onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { app } from './firebaseApp';

/**
 * Send OTP to the specified phone number. The phone number must include country code, e.g. '+91XXXXXXXXXX'.
 * Returns a ConfirmationResult that you must keep to later confirm the code.
 */
export async function sendOTP(phone) {
  if (!phone || typeof phone !== 'string') throw new Error('phone is required');
  const auth = getAuth(app);
  const confirmation = await signInWithPhoneNumber(auth, phone);
  return confirmation; // holds .confirm(code)
}

/**
 * Verify the received code using the ConfirmationResult from sendOTP.
 */
export async function verifyOTP(confirmation, code) {
  if (!confirmation || !code) throw new Error('confirmation and code are required');
  const cred = await confirmation.confirm(code);
  return cred; // Firebase auth UserCredential
}

/**
 * Subscribe to Firebase auth state changes.
 */
export function subscribeToAuthState(callback) {
  const auth = getAuth(app);
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user's ID token (JWT) to send to backend Authorization: Bearer <token>.
 */
export async function getIdToken(forceRefresh = false) {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export async function signOutUser() {
  const auth = getAuth(app);
  return signOut(auth);
}

/**
 * Send email verification to the currently signed-in user (if any)
 */
export async function sendUserEmailVerification() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
    return true;
  }
  return false;
}
