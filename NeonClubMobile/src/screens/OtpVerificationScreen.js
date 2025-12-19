import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api, { probeAndFixBase } from '../services/api';
import { NEON_COLORS } from '../utils/colors';

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('send'); // 'send' or 'verify'

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      try { await probeAndFixBase(); } catch {}
      // Normalize to new backend contract
      const digits = (phoneNumber || '').replace(/\D/g, '').slice(0, 10);
      const payload = { phoneNumber: `+91${digits}` };
      const response = await api.post('/otp/sendPhoneOTP', payload, { timeout: 8000 });
      if (response.data.success) {
        // Always use dummy OTP 123456 for testing
        setOtp('123456');
        if (__DEV__) Alert.alert('Dev OTP', 'Use code: 123456');
        Alert.alert('Success', 'OTP sent successfully');
        setStep('verify');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      Alert.alert('Error', 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      try { await probeAndFixBase(); } catch {}
      const digits = (phoneNumber || '').replace(/\D/g, '').slice(0, 10);
      const response = await api.post('/otp/verifyOTP', { type: 'phone', identifier: `+91${digits}`, otp }, { timeout: 8000 });
      if (response.data.success) {
        Alert.alert('Success', 'OTP verified successfully');
        navigation.navigate('ProfileSetupScreen', { isNewUser: response.data.isNewUser });
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      Alert.alert('Error', 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>

      {step === 'send' ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEON_COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
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
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: NEON_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;