// OTP helpers for React Native Firebase Phone Auth
// Minimal wrapper so screens can import without changing existing flows

import auth from '@react-native-firebase/auth';

/**
 * Send OTP to the specified phone number. The phone number must include country code, e.g. '+91XXXXXXXXXX'.
 * Returns a ConfirmationResult that you must keep to later confirm the code.
 */
export async function sendOTP(phone) {
  if (!phone || typeof phone !== 'string') throw new Error('phone is required');
  const confirmation = await auth().signInWithPhoneNumber(phone);
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
export function onAuthStateChanged(callback) {
  return auth().onAuthStateChanged(callback);
}

/**
 * Get current user's ID token (JWT) to send to backend Authorization: Bearer <token>.
 */
export async function getIdToken(forceRefresh = false) {
  const user = auth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export async function signOut() {
  return auth().signOut();
}

/**
 * Send email verification to the currently signed-in user (if any)
 */
export async function sendEmailVerification() {
  const user = auth().currentUser;
  if (user && !user.emailVerified) {
    await user.sendEmailVerification();
    return true;
  }
  return false;
}
