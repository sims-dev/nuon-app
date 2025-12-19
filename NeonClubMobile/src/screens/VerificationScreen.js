import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
  const { type, contact } = route.params; // type: 'email' or 'phone'
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, accept any 6-digit code
      Alert.alert(
        'Success',
        `${type === 'email' ? 'Email' : 'Phone'} verified successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setCanResend(false);
    setTimer(60);
    
    // Simulate resend API call
    Alert.alert('Success', 'Verification code sent!');
    
    // Restart timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify {type === 'email' ? 'Email' : 'Phone'}</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.contact}>{contact}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Enter verification code</Text>
        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor="#666666"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={verifyCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={resendCode}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {timer}s
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 10,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  contact: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  label: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF1493',
    borderRadius: 10,
    padding: 20,
    fontSize: 24,
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A',
    marginBottom: 20,
    letterSpacing: 10,
  },
  verifyButton: {
    backgroundColor: '#00FFFF',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  verifyButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: '#FF1493',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#666666',
    fontSize: 16,
  },
});

export default VerificationScreen;