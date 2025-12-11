import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { probeAndFixBase, getCurrentBaseURL, authAPI } from '../services/api';
import FullScreenLoader from '../components/FullScreenLoader';
import { AuthContext } from '../contexts/AuthContext';
import NEON_COLORS from '../utils/colors';



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // You can log error here
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <Text style={{ color: '#d00', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ color: '#333', marginBottom: 16 }}>{this.state.error?.message || 'Unknown error'}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}


const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { updateUser, token, setToken } = useContext(AuthContext);
  // Defensive: ensure route.params exists and is an object
  const params = (route && route.params && typeof route.params === 'object') ? route.params : {};
  const initialUser = params.user || {};
  const paramToken = params.token;
  const isNewUser = params.isNewUser || false;

  // Ensure token is set in context if passed via navigation
  useEffect(() => {
    if (paramToken && !token) {
      console.log('Setting token from navigation params:', paramToken);
      setToken(paramToken);
      // Persist token to AsyncStorage for consistency
      AsyncStorage.setItem('token', paramToken).catch(() => {});
    }
  }, [paramToken, token, setToken]);

  // Initialize form data - start with empty fields for real-time completion
  // Don't prefill any data, let user enter everything fresh
  useEffect(() => {
    console.log('Profile setup initialized - user must complete all fields manually');
    setFormData({
      name: '',
      email: '',
      specialization: '',
      experience: '',
      organization: '',
      location: '',
      city: '',
      state: '',
    });
  }, []);

  // Multi-step state
  const [step, setStep] = useState(0); // 0: Personal, 1: Professional, 2: Location
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    organization: '',
    location: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // For new user registration, we don't need a token initially
  // The token will be generated after successful registration

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step validation
  const validateStep = () => {
    if (step === 0) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill all personal details.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return false;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        return false;
      }
    } else if (step === 1) {
      if (!formData.specialization || !formData.experience || !formData.organization) {
        Alert.alert('Error', 'Please fill all professional details.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.location || !formData.city || !formData.state) {
        Alert.alert('Error', 'Please fill all location details.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      console.log('[PROFILE SETUP] Starting profile completion...');
      console.log('[PROFILE SETUP] Initial user data:', initialUser);
      console.log('[PROFILE SETUP] Form data:', formData);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: initialUser?.phoneNumber || '', // Store phone number from OTP auth
        specialization: formData.specialization.trim(),
        experience: parseInt(formData.experience) || 0,
        organization: formData.organization.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        location: [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', '),
        isProfileComplete: true,
      };

      console.log('[PROFILE SETUP] Final payload:', payload);
      console.log('[PROFILE SETUP] Current token:', token ? 'Present' : 'Missing');
      console.log('[PROFILE SETUP] Token length:', token?.length);

      // Use /register endpoint for profile completion
      console.log('[PROFILE SETUP] Making API call to /register...');
      const response = await authAPI.register(payload);

      console.log('[PROFILE SETUP] API call successful, response status:', response.status);
      console.log('[PROFILE SETUP] Full response data:', response.data);

      if (response.data?.success) {
        const newUser = response.data.user;
        const newToken = response.data.token;
        console.log('New user registered:', newUser);
        console.log('Registration token:', newToken);

        // Store token and user data
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));

        // Update auth context
        setToken(newToken);
        updateUser(newUser);

        setLoading(false);
        Alert.alert('Success', 'Registration complete! Welcome to Neon Club!');

        // Fetch latest user profile to ensure isProfileComplete is true in context
        setTimeout(async () => {
          try {
            const profileResp = await fetchApi(`/profile/${newUser.id || newUser._id}`);
            if (profileResp.data && profileResp.data.user) {
              await AsyncStorage.setItem('user', JSON.stringify(profileResp.data.user));
              updateUser(profileResp.data.user);
              console.log('User context updated with latest profile:', profileResp.data.user);
            }
          } catch (e) {
            console.warn('Failed to fetch latest profile after registration:', e);
          }
          // Navigate to Splash (navigator will redirect to Main/dashboard)
          navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        }, 500);
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      console.error('API Error response:', apiError.response?.data);
      console.error('API Error status:', apiError.response?.status);
      console.error('API Error headers:', apiError.response?.headers);
      setLoading(false);

      // Check if it's a token/auth issue
      if (apiError.response?.status === 401) {
        Alert.alert('Authentication Error', 'Your session has expired. Please login again.');
        // Clear token and navigate to login
        setToken(null);
        AsyncStorage.removeItem('token').catch(() => {});
        AsyncStorage.removeItem('user').catch(() => {});
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        return;
      }

      const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to setup profile';
      Alert.alert('Error', `Profile setup failed: ${errorMessage}\nStatus: ${apiError.response?.status || 'Unknown'}`);
    }
  };

  return (
    <ErrorBoundary>
      <LinearGradient colors={NEON_COLORS.gradientPurpleToBlue} style={styles.container}>
        <View style={styles.floatingCircle1} />
        <View style={styles.floatingCircle2} />
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <View style={styles.logoContainer}><Text style={styles.logoIcon}>⚡</Text></View>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Step {step + 1} of 3</Text>
              <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('OTPAuth')}>
                <Text style={styles.loginLinkText}>Complete Your Profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <View style={styles.card}>
                {step === 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Personal Details</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Name *</Text>
                      <TextInput style={styles.input} placeholder="Enter your name" value={formData.name} onChangeText={(v) => handleInputChange('name', v)} placeholderTextColor="#666" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email *</Text>
                      <TextInput style={styles.input} placeholder="Enter your email" value={formData.email} onChangeText={(v) => handleInputChange('email', v)} placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Password *</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput style={styles.passwordInput} placeholder="Enter your password" value={formData.password} onChangeText={(v) => handleInputChange('password', v)} placeholderTextColor="#666" secureTextEntry />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Confirm Password *</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput style={styles.passwordInput} placeholder="Confirm your password" value={formData.confirmPassword} onChangeText={(v) => handleInputChange('confirmPassword', v)} placeholderTextColor="#666" secureTextEntry />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <Text style={styles.eyeText}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
                {step === 1 && (
                  <>
                    <Text style={styles.sectionTitle}>Professional Details</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Specialization *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Pediatric Nursing, ICU" value={formData.specialization} onChangeText={(v) => handleInputChange('specialization', v)} placeholderTextColor="#666" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Experience (years) *</Text>
                      <TextInput style={styles.input} placeholder="e.g., 3" value={formData.experience} onChangeText={(v) => handleInputChange('experience', v)} placeholderTextColor="#666" keyboardType="numeric" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Organization *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Apollo Hospitals" value={formData.organization} onChangeText={(v) => handleInputChange('organization', v)} placeholderTextColor="#666" />
                    </View>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Text style={styles.sectionTitle}>Location Details</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Location *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Mumbai" value={formData.location} onChangeText={(v) => handleInputChange('location', v)} placeholderTextColor="#666" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>City *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Mumbai" value={formData.city} onChangeText={(v) => handleInputChange('city', v)} placeholderTextColor="#666" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>State *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Maharashtra" value={formData.state} onChangeText={(v) => handleInputChange('state', v)} placeholderTextColor="#666" />
                    </View>
                  </>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                  {step > 0 && (
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#ddd', flex: 1, marginRight: 8 }]} onPress={handleBack} disabled={loading}>
                      <Text style={[styles.primaryButtonText, { color: '#333' }]}>Back</Text>
                    </TouchableOpacity>
                  )}
                  {step < 2 && (
                    <TouchableOpacity style={[styles.button, styles.primaryButton, { flex: 1 }]} onPress={handleNext} disabled={loading}>
                      <Text style={styles.primaryButtonText}>Next</Text>
                    </TouchableOpacity>
                  )}
                  {step === 2 && (
                    <TouchableOpacity style={[styles.button, styles.primaryButton, { flex: 1 }]} onPress={handleSubmit} disabled={loading}>
                      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Submit</Text>}
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ErrorBoundary>
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
    marginBottom: 12,
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
    marginBottom: 8,
  },
  loginLink: {
    marginTop: 8,
    padding: 8,
  },
  loginLinkText: {
    color: NEON_COLORS.neonCyan,
    fontSize: 14,
    textAlign: 'center',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NEON_COLORS.neonCyan,
    marginBottom: 12,
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
  signInContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: NEON_COLORS.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  eyeText: {
    fontSize: 16,
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
export default ProfileSetupScreen;