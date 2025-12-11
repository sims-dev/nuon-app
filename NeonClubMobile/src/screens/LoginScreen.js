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
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { authAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import NEON_COLORS from '../utils/colors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setToken, updateUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Use fetch for React Native compatibility
      const response = await fetch('http://192.168.0.209:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      const { token, user } = data;

      // Store token and user data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update auth context
      setToken(token);
      updateUser(user);

      Alert.alert('Success', 'Login successful!');

      // Check if user profile is complete and navigate accordingly
      if (user?.isProfileComplete) {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
      } else {
        // Navigate to profile setup if profile is incomplete
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{
            name: 'ProfileSetup',
            params: {
              user: user,
              token: token,
              isNewUser: false
            }
          }]
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goToProfileSetup = () => {
    navigation.navigate('ProfileSetup', {
      user: null,
      token: null,
      isNewUser: true
    });
  };

  return (
    <LinearGradient colors={NEON_COLORS.gradientPurpleToBlue} style={styles.container}>
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}><Text style={styles.logoIcon}>⚡</Text></View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              </View>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleEmailLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={goToProfileSetup}>
                <Text style={styles.linkText}>Complete Your Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    left: -60,
  },
  floatingCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -40,
    right: -40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 32,
    color: NEON_COLORS.neonCyan,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: NEON_COLORS.textSecondary,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: NEON_COLORS.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: NEON_COLORS.textPrimary,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
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
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: NEON_COLORS.neonCyan,
    fontSize: 14,
  },
});

export default LoginScreen;