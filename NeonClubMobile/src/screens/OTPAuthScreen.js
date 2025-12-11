import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { probeAndFixBase, getCurrentBaseURL, setBaseOverride, authAPI } from '../services/api';
import { sendOTP as fbSendOTP, verifyOTP as fbVerifyOTP, getIdToken as fbGetIdToken } from '../services/otp';
import { ensureFirebaseInitialized } from '../services/firebaseApp';
import { CONFIG, DEV_BASE_LAN } from '../utils/config';
import FullScreenLoader from '../components/FullScreenLoader';
import { registerPushTokenIfAvailable } from '../utils/notifications';
import { AuthContext } from '../contexts/AuthContext';
import { NEON_COLORS } from '../utils/colors';

const OTPAuthScreen = () => {
  const navigation = useNavigation();
  const { updateUser, setToken } = useContext(AuthContext);
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' or 'email'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [fbConfirmation, setFbConfirmation] = useState(null);
  const [otpSession, setOtpSession] = useState(null); // idempotent session header for backend

  // Dev helper: base is locked; show current base instead of cycling
  const devCycleBase = async () => {
    if (!__DEV__) return;
    const current = getCurrentBaseURL && getCurrentBaseURL();
    Alert.alert('API Base (locked)', current || CONFIG.API_BASE_URL);
  };

  const handleSendOTP = async () => {
    const value = identifier.trim();
    if (!value) {
      Alert.alert('Error', `Please enter your ${authMethod === 'phone' ? 'phone number' : 'email'}`);
      return;
    }
    // Validate inputs
    if (authMethod === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) {
        Alert.alert('Invalid Number', 'Enter a valid 10-digit mobile number');
        return;
      }
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailOk) {
        Alert.alert('Invalid Email', 'Enter a valid email address');
        return;
      }
    }

    try {
  setLoading(true);
  const session = (Math.random().toString(36).slice(2) + Date.now().toString(36));
  setOtpSession(session);
      const digits = value.replace(/\D/g, '');
      const fullPhone = `+91${digits}`;

      // Always use backend API for OTP (send/verify) in all environments
      try { await probeAndFixBase(); } catch {}
      let endpoint = '/otp/send/phone';
      let body = { type: 'phone', identifier: fullPhone, phoneNumber: fullPhone };
      if (authMethod === 'email') {
        endpoint = '/otp/send/email';
        body = { type: 'email', identifier: value.toLowerCase(), email: value.toLowerCase() };
      }
      const resp = await fetchApi(endpoint, { method: 'POST', body, headers: { 'x-otp-session': session }, timeout: 5000 });

      // Use the actual OTP from backend response if present
      const backendOTP = resp?.data?.debugOtp;
      if (backendOTP) {
        setOtp(backendOTP);
        Alert.alert('OTP Sent', `Use this OTP to verify: ${backendOTP}`, [
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('OTP Sent', 'OTP sent successfully. Please check your SMS or email.');
      }
      console.log('OTP sent successfully, debugOtp:', backendOTP);
      if (__DEV__) console.log('Using backend OTP, response mode:', resp?.data?.mode, 'debugOtp:', backendOTP);
      setStep('verify');
      setResendTimer(60);
      startResendTimer();
    } catch (error) {
      console.error('Send OTP error:', error?.response?.data || error?.message || error);
      const baseNow = getCurrentBaseURL && getCurrentBaseURL();
      const msg = (error?.response?.data?.message || 'Failed to send OTP') + `\nBase: ${baseNow || 'n/a'}`;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Invalid OTP', 'Enter the 6 digit code');
      return;
    }
    try {
  setLoading(true);
      const value = identifier.trim();

      let res;

      // Firebase verification for phone authentication
      if (CONFIG.OTP_PROVIDER === 'firebase' && authMethod === 'phone' && fbConfirmation) {
        try {
          await ensureFirebaseInitialized();
          await fbVerifyOTP(fbConfirmation, otp);
          const firebaseIdToken = await fbGetIdToken(true);
          try { await probeAndFixBase(); } catch {}
          const payload = {
            type: 'phone',
            identifier: `+91${value.replace(/\D/g, '')}`,
            otp,
            firebaseIdToken,
            provider: 'firebase',
            session: otpSession
          };
          res = await authAPI.verifyOTP(payload);
          if (__DEV__) console.log('Verified using Firebase');
        } catch (firebaseError) {
          console.warn('Firebase verification failed:', firebaseError.message);
          Alert.alert('Error', 'Firebase verification failed. Please try again.');
          return;
        }
      } else {
        // Backend verification for email or fallback
        try { await probeAndFixBase(); } catch {}
        const payload = authMethod === 'phone'
          ? { type: 'phone', identifier: `+91${value.replace(/\D/g, '')}`, otp, provider: 'backend' }
          : { type: 'email', identifier: value.toLowerCase(), otp };
        res = await authAPI.verifyOTP({ ...payload, session: otpSession });
        if (__DEV__) console.log('Verified using backend');
      }
  let { token, user, isNewUser } = res?.data || {};
      // Ensure phone number captured flows into profile
      if (authMethod === 'phone') {
        const digits = (identifier || '').replace(/\D/g, '');
        const phone = digits ? `+91${digits}` : null;
        if (phone) {
          user = { ...(user || {}), phoneNumber: user?.phoneNumber || phone };
        }
      }
      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        updateUser(user);
        try { await registerPushTokenIfAvailable(); } catch {}
      }
      Alert.alert('Success', 'OTP verified successfully');

      // Always navigate to ProfileSetup for new users to complete their profile
      // Pass phone number for storage in profile
      const phoneNumber = authMethod === 'phone' ? `+91${identifier.replace(/\D/g, '')}` : null;

      navigation.reset({
        index: 0,
        routes: [{
          name: 'ProfileSetup',
          params: {
            user: { ...user, phoneNumber: user?.phoneNumber || phoneNumber },
            token: token,
            isNewUser: true // Always treat as new user for profile completion
          }
        }]
      });
    } catch (error) {
      console.error('Verify OTP error:', error?.response?.data || error?.message || error);
      const baseNow = getCurrentBaseURL && getCurrentBaseURL();
      Alert.alert('Error', (error?.response?.data?.message || 'Failed to verify OTP') + `\nBase: ${baseNow || 'n/a'}`);
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    setOtp('');
    handleSendOTP();
  };

  const switchAuthMethod = () => {
    setAuthMethod(authMethod === 'phone' ? 'email' : 'phone');
    setIdentifier('');
    setOtp('');
    setStep('input');
    setResendTimer(0);
  };

  return (
    <LinearGradient
      colors={NEON_COLORS.gradientPurpleToBlue}
      style={styles.container}
    >
      <FullScreenLoader visible={loading} label={step==='input' ? 'Sending OTP…' : 'Verifying…'} />
      {/* Animated floating circles */}
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer} onLongPress={devCycleBase}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.title}>Welcome to Neon Club</Text>
          <Text style={styles.subtitle}>
            {step === 'input'
              ? `Enter your ${authMethod === 'phone' ? 'phone number' : 'email'} to get started`
              : `Enter the 6-digit code sent to your ${authMethod}`
            }
          </Text>
        </View>

        <View style={styles.form}>
        {step === 'input' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={authMethod === 'phone' ? '10-digit mobile number' : 'your@email.com'}
                value={identifier}
                onChangeText={(txt) => {
                  if (authMethod === 'phone') {
                    const digits = txt.replace(/\D/g, '').slice(0, 10);
                    setIdentifier(digits);
                  } else {
                    setIdentifier(txt.trim());
                  }
                }}
                keyboardType={authMethod === 'phone' ? 'number-pad' : 'email-address'}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={authMethod === 'phone' ? 10 : 100}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, ((authMethod === 'phone' && identifier.replace(/\D/g, '').length !== 10) || (authMethod === 'email' && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(identifier))) && { opacity: 0.6 }]}
              onPress={handleSendOTP}
              disabled={loading || (authMethod === 'phone' ? identifier.replace(/\D/g, '').length !== 10 : !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(identifier))}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            {/* Sign In link for existing users - in phone number input step */}
            <TouchableOpacity
              style={styles.signInContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signInText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                value={otp}
                onChangeText={(t) => setOtp((t || '').replace(/\D/g, '').slice(0, 6))}
                keyboardType="numeric"
                maxLength={6}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

          </>
        )}

        {step === 'input' && (
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={switchAuthMethod}
          >
            <Text style={styles.switchText}>
              Use {authMethod === 'phone' ? 'email' : 'phone number'} instead
            </Text>
          </TouchableOpacity>
        )}

        {step === 'verify' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setStep('input');
              setOtp('');
              setResendTimer(0);
            }}
          >
            <Text style={styles.backButtonText}>Change {authMethod}</Text>
          </TouchableOpacity>
        )}
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingCircle1: {
    position: 'absolute',
    top: 100,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: NEON_COLORS.neonPurpleGlow,
    opacity: 0.6,
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: 200,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: NEON_COLORS.neonBlueGlow,
    opacity: 0.5,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: NEON_COLORS.glassBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: NEON_COLORS.glassBorder,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
    color: NEON_COLORS.neonPurple,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: NEON_COLORS.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: NEON_COLORS.neonBlue,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: NEON_COLORS.glassBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: NEON_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: NEON_COLORS.glassBorder,
    backdropFilter: 'blur(10px)',
  },
  otpInput: {
    backgroundColor: NEON_COLORS.glassBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: NEON_COLORS.neonCyan,
    borderWidth: 2,
    borderColor: NEON_COLORS.neonCyan,
    textAlign: 'center',
    letterSpacing: 8,
    backdropFilter: 'blur(10px)',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: NEON_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  timerText: {
    color: NEON_COLORS.textSecondary,
    fontSize: 14,
  },
  resendText: {
    color: NEON_COLORS.neonCyan,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    color: NEON_COLORS.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: NEON_COLORS.neonCyan,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#00FFFF', // Bright cyan color for better visibility
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default OTPAuthScreen;