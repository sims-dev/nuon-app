import React, { useState, useContext, useRef, useEffect } from 'react';
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
import { useNavigation, CommonActions } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import api, { probeAndFixBase, getCurrentBaseURL, setBaseOverride } from '../services/api';
import { sendOTP as fbSendOTP, verifyOTP as fbVerifyOTP, getIdToken as fbGetIdToken } from '../services/otp';
import { ensureFirebaseInitialized } from '../services/firebaseApp';
import { CONFIG, DEV_BASE_LAN } from '../utils/config';
import { registerPushTokenIfAvailable } from '../utils/notifications';
import { AuthContext } from '../contexts/AuthContext';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { NEON_COLORS } from '../utils/colors';
import { NuonIcon } from '../components/NuonLogo';
import { navigationRef } from '../AppNavigator';

const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

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
  const [inputFocused, setInputFocused] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(-1);

  // OTP input refs for auto-focus
  const otpInputRefs = useRef([]);
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    // Auto-focus first OTP input when step changes to verify
    if (step === 'verify' && otpInputRefs.current[0]) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

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
      let endpoint = '/otp/send-phone';
      let body = { phoneNumber: fullPhone };
      if (authMethod === 'email') {
        endpoint = '/otp/send-email';
        body = { email: value.toLowerCase() };
      }
      const resp = await api.post(endpoint, body, { timeout: 5000, headers: { 'x-otp-session': session } });

      // Removed automatic OTP setting - user must enter dummy OTP manually
      console.log('OTP sent successfully');
      if (__DEV__) console.log('OTP sent, user must enter manually');
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
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Invalid OTP', 'Enter the 6 digit code');
      isVerifyingRef.current = false;
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
          res = await api.post('/otp/verify', {
            type: 'phone',
            identifier: `+91${value.replace(/\D/g, '')}`,
            firebaseIdToken,
            provider: 'firebase'
          }, { timeout: 5000, headers: otpSession ? { 'x-otp-session': otpSession } : undefined });
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
        res = await api.post('/otp/verify', payload, { timeout: 5000, headers: otpSession ? { 'x-otp-session': otpSession } : undefined });
        if (__DEV__) console.log('Verified using backend');
      }
      console.log('[OTPAuth] OTP verification API response:', res);
  let { token, user, isNewUser } = res?.data || {};
      console.log('[OTPAuth] Extracted token:', !!token, 'user:', !!user, 'isNewUser:', isNewUser);
      console.log('[OTPAuth] User object from API:', JSON.stringify(user, null, 2));
      // Ensure phone number captured flows into profile
      if (authMethod === 'phone') {
        const digits = (identifier || '').replace(/\D/g, '');
        const phone = digits ? `+91${digits}` : null;
        if (phone) {
          user = { ...(user || {}), phoneNumber: user?.phoneNumber || phone };
        }
      }
      console.log('[OTPAuth] User after phone update:', JSON.stringify(user, null, 2));
      if (token) {
        console.log('[OTPAuth] About to update user and token');
        await AsyncStorage.setItem('token', token);
        // Let AuthContext determine profileIncomplete based on user data
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('[OTPAuth] Calling updateUser with user:', JSON.stringify(user, null, 2));
        updateUser(user);
        console.log('[OTPAuth] updateUser called');
        setToken(token);
        console.log('[OTPAuth] setToken called');
        try { await registerPushTokenIfAvailable(); } catch {}

        if (isNewUser) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'ProfileSetup' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Main',
              state: {
                routes: [{
                  name: 'Home'
                }]
              }
            }],
          });
        }
      }

      console.log('[DEBUG] OTP Verification - User authenticated:', { isNewUser, user: user?.name, email: user?.email, isProfileComplete: user?.isProfileComplete, profileIncomplete: user?.profileIncomplete });
      console.log('[DEBUG] Full response data:', res?.data);
      console.log('[DEBUG] User object after verification:', JSON.stringify(user, null, 2));
    } catch (error) {
      console.error('Verify OTP error details:', JSON.stringify({
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        stack: error?.stack
      }, null, 2));
      const baseNow = getCurrentBaseURL && getCurrentBaseURL();
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to verify OTP';
      Alert.alert('Error', `${errorMessage}\nBase: ${baseNow || 'n/a'}`);
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
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

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#9333EA', '#4F46E5', '#2563EB']} // purple-600 via indigo-600 to blue-600
      style={styles.container}
    >
      {/* Animated background */}
      <View style={styles.animatedBackground}>
        <View style={styles.floatingCircle1} />
        <View style={styles.floatingCircle2} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.neonGlowPurple}>
              <NuonIcon size={80} variant="default" />
            </View>
          </View>
          <Text style={styles.title}>Welcome to NUON</Text>
          <Text style={styles.tagline}>Nurse United, Opportunities Nourished</Text>
        </View>

        <View style={styles.form}>
        {step === 'input' ? (
          <>
            {/* White card container */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Login / Sign Up</Text>
                <Text style={styles.cardSubtitle}>Enter your phone number to continue</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.phoneInputWrapper, inputFocused && { borderColor: NEON_COLORS.neonPurple }]}>
                  <SvgXml xml={phoneSvg} width={20} height={20} color="#9CA3AF" style={{marginRight: 8}} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+91 XXXXX XXXXX"
                    value={identifier}
                    onChangeText={(txt) => {
                      const digits = txt.replace(/\D/g, '').slice(0, 10);
                      setIdentifier(digits);
                    }}
                    keyboardType="number-pad"
                    placeholderTextColor="#9CA3AF"
                    maxLength={10}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </View>
                <Text style={styles.helperText}>
                  We'll send you a 6-digit OTP to verify your number
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendOTP}
                disabled={loading || identifier.replace(/\D/g, '').length !== 10}
              >
                <LinearGradient colors={identifier.replace(/\D/g, '').length === 10 ? NEON_COLORS.gradientPurpleToBlue : [NEON_COLORS.neonPurpleGlow, NEON_COLORS.neonBlueGlow]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                      <Text style={styles.arrowIcon}>→</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* White card container for OTP */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <View style={styles.otpIconContainer}>
                  <LinearGradient
                    colors={['#E9D5FF', '#DBEAFE']} // from-purple-100 to-blue-100
                    style={styles.otpIconGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <SvgXml xml={phoneSvg} width={32} height={32} color={NEON_COLORS.neonBlueGlow} />
                  </LinearGradient>
                </View>
                <Text style={[styles.cardTitle, {fontSize: 15}]}>Verify OTP</Text>
                <Text style={styles.cardSubtitle}>
                  We've sent a 6-digit code to{'\n'}
                  <Text style={styles.phoneNumberDisplay}>{identifier}</Text>
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelCenter}>Enter OTP</Text>
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpInputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        focusedOtpIndex === index && {borderColor: '#2563EB', backgroundColor: '#DBEAFE'}
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={otp[index] || ''}
                      onFocus={() => setFocusedOtpIndex(index)}
                      onBlur={() => setFocusedOtpIndex(-1)}
                      onChangeText={(text) => {
                        // Prevent entering if previous field is not filled
                        if (index > 0 && !otp[index - 1] && text) return;

                        const newOtp = otp.split('');
                        newOtp[index] = text;
                        const updatedOtp = newOtp.join('');
                        setOtp(updatedOtp);

                        // Auto-focus next input if text entered
                        if (text && index < 5) {
                          otpInputRefs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        // Auto-focus previous input on backspace
                        if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                          otpInputRefs.current[index - 1]?.focus();
                        }
                      }}
                      placeholderTextColor="#D1D5DB"
                    />
                  ))}
                </View>
              </View>

              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in {resendTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                    <Text style={styles.resendText}>
                      Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                <LinearGradient colors={otp.length === 6 ? NEON_COLORS.gradientPurpleToBlue : [NEON_COLORS.neonPurpleGlow, NEON_COLORS.neonBlueGlow]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.buttonGradient}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => {
                  setStep('input');
                  setOtp('');
                  setResendTimer(0);
                }}
              >
                <Text style={styles.changeNumberText}>Change Phone Number</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        </View>
        {/* Footer */}
        <View style={[styles.footerOuter, { marginBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.footerText}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  floatingCircle1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(192, 132, 252, 0.2)', // purple-400/20
    opacity: 0.6,
    // Note: React Native doesn't have blur-3xl, using shadow for similar effect
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(96, 165, 250, 0.2)', // blue-400/20
    opacity: 0.5,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 16, // reduced
    alignItems: 'center',
    justifyContent: 'center',
  },
  neonGlowPurple: {
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  logoImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    color: '#E9D5FF', // purple-100
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 480, // increased width
    alignSelf: 'center',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24, // rounded-3xl
    padding: 33, // increased for more length
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
    marginBottom: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLogoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginBottom: 15,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280', // gray-600
    textAlign: 'center',
  },
  phoneNumberDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  otpIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  otpIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpIcon: {
    fontSize: 32,
    color: '#2563EB', // blue-600
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // gray-700
    marginBottom: 8,
  },
  labelCenter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    borderColor: '#E5E7EB', // gray-200
    height: 56, // h-14
    paddingHorizontal: 12,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#9CA3AF', // gray-400
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  otpInput: {
    width: 44, // reduced width
    height: 60, // increased height
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB', // gray-200
    backgroundColor: '#FFFFFF',
    fontSize: 18, // text-lg
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    marginHorizontal: 2,
  },
  otpInputFilled: {
    borderColor: '#2563EB', // blue-600 when filled
    backgroundColor: '#EFF6FF', // blue-50
  },
  primaryButton: {
    borderRadius: 9999, // rounded-full
    height: 48, // reduced
    marginTop: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendText: {
    fontSize: 14,
    color: NEON_COLORS.neonPurple,
  },
  resendLink: {
    color: NEON_COLORS.neonPurple,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  changeNumberButton: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 0,
  },
  changeNumberOuter: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  changeNumberText: {
    fontSize: 14,
    color: '#6B7280', // gray-600
  },
  footerText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 0,
  },
  footerOuter: {
    marginTop: 24, // mt-6
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default OTPAuthScreen;