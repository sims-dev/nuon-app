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
import { InteractionManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import api, { probeAndFixBase, getCurrentBaseURL } from '../services/api';
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

  // Show popup for incomplete profile
  useEffect(() => {
    if (initialUser?.profileIncomplete) {
      setTimeout(() => {
        Alert.alert(
          'Complete Your Profile',
          'Please complete your professional details to unlock all features and get the most out of your NUON experience.',
          [{ text: 'OK' }]
        );
      }, 500); // Delay to show after screen loads
    }
  }, [initialUser]);

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

  // Multi-step state - Now 3 steps: Personal, Professional (skippable), Location
  const [step, setStep] = useState(1); // 1: Personal, 2: Professional (skippable), 3: Location
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    organization: '',
    registrationNumber: '',
    highestQualification: '',
    location: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const totalSteps = 3;

  // For new user registration, we don't need a token initially
  // The token will be generated after successful registration

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step validation
  const validateStep = () => {
    if (step === 1) {
      // Step 1: Personal Information - Required
      if (!formData.name || !formData.email || !formData.specialization || !formData.experience) {
        Alert.alert('Error', 'Please fill in all required fields (Name, Email, Specialization, Experience).');
        return false;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return false;
      }
    } else if (step === 2) {
      // Step 2: Professional Information - OPTIONAL (can be skipped)
      // No validation required, user can skip this step
      return true;
    } else if (step === 3) {
      // Step 3: Location - Required
      if (!formData.city || !formData.state) {
        Alert.alert('Error', 'Please fill in City and State.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  // Add skip functionality for Step 2 (Professional Details)
  const handleSkip = () => {
    if (step === 2) {
      Alert.alert(
        'Skip Professional Details?',
        'You can complete these details later from your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Skip', onPress: () => {
            // Mark as incomplete and go to main
            updateUser({ ...initialUser, profileIncomplete: true });
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
          }}
        ]
      );
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      console.log('[PROFILE SETUP] Starting profile completion...');
      console.log('[PROFILE SETUP] Initial user data:', initialUser);
      console.log('[PROFILE SETUP] Form data:', formData);

      // Check if professional details are filled
      const hasCompletedProfessionalDetails = Boolean(
        formData.organization?.trim() && 
        formData.registrationNumber?.trim() && 
        formData.highestQualification?.trim()
      );

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password || 'temp123', // Fallback if password not set
        phoneNumber: initialUser?.phoneNumber || '', // Store phone number from OTP auth
        specialization: formData.specialization.trim(),
        experience: parseInt(formData.experience) || 0,
        organization: formData.organization?.trim() || '',
        registrationNumber: formData.registrationNumber?.trim() || '',
        highestQualification: formData.highestQualification?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        location: [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', '),
        isProfileComplete: hasCompletedProfessionalDetails, // Mark as complete only if all details filled
        profileIncomplete: !hasCompletedProfessionalDetails, // Flag for incomplete profile
      };

      console.log('[PROFILE SETUP] Final payload:', payload);
      console.log('[PROFILE SETUP] Profile incomplete flag:', !hasCompletedProfessionalDetails);

      // Use /register endpoint for profile completion
      console.log('[PROFILE SETUP] Making API call to /register...');
      const response = await api.post('/register', payload, {
        timeout: 10000
      });

      console.log('[PROFILE SETUP] API call successful, response status:', response.status);

      if (response.data?.success) {
        const newUser = response.data.user;
        const newToken = response.data.token;
        
        // Add profile incomplete flag to user object
        newUser.profileIncomplete = !hasCompletedProfessionalDetails;
        
        console.log('New user registered:', newUser);
        console.log('Registration token:', newToken);

        // Store token and user data
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));

        // Update auth context
        setToken(newToken);
        updateUser({ ...newUser, profileIncomplete: !hasCompletedProfessionalDetails });

        console.log('[DEBUG] Profile setup completed:', {
          hasCompletedProfessionalDetails,
          profileIncomplete: !hasCompletedProfessionalDetails,
          user: newUser?.name
        });

        setLoading(false);

        if (!hasCompletedProfessionalDetails) {
          Alert.alert(
            'Profile Partially Complete',
            'You can complete your professional details anytime from your profile.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Success', 'Registration complete! Welcome to Neon Club!');
        }

        // Navigate to dashboard
        console.log('[DEBUG] Navigating to Main after profile setup');
        setTimeout(() => {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
        }, 600);
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      setLoading(false);

      if (apiError.response?.status === 401) {
        Alert.alert('Authentication Error', 'Your session has expired. Please login again.');
        setToken(null);
        AsyncStorage.removeItem('token').catch(() => {});
        AsyncStorage.removeItem('user').catch(() => {});
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        return;
      }

      const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to setup profile';
      Alert.alert('Error', `Profile setup failed: ${errorMessage}`);
    }
  };

  return (
    <ErrorBoundary>
      <LinearGradient colors={NEON_COLORS.gradientPurpleToBlue} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.container}>
        <View style={styles.floatingCircle1} />
        <View style={styles.floatingCircle2} />
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <View style={styles.logoContainer}><Text style={styles.logoIcon}>⚡</Text></View>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Step {step} of {totalSteps}</Text>
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
              </View>
            </View>
            <View style={styles.form}>
              <View style={styles.card}>
                {step === 1 && (
                  <>
                    <Text style={styles.sectionTitle}>📋 Personal Information</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Full Name *</Text>
                      <TextInput style={styles.input} placeholder="Enter your full name" value={formData.name} onChangeText={(v) => handleInputChange('name', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email Address *</Text>
                      <TextInput style={styles.input} placeholder="your.email@example.com" value={formData.email} onChangeText={(v) => handleInputChange('email', v)} placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Specialization *</Text>
                      <TextInput style={styles.input} placeholder="e.g., General Nursing, Critical Care, Pediatric" value={formData.specialization} onChangeText={(v) => handleInputChange('specialization', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Years of Experience *</Text>
                      <TextInput style={styles.input} placeholder="e.g., 0-1, 1-3, 3-5, 5-10, 10+" value={formData.experience} onChangeText={(v) => handleInputChange('experience', v)} placeholderTextColor="#999" keyboardType="numeric" />
                    </View>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Text style={styles.sectionTitle}>💼 Professional Information (Optional)</Text>
                    <Text style={styles.helperText}>You can skip this and complete later</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Current Workplace</Text>
                      <TextInput style={styles.input} placeholder="Hospital/Clinic name" value={formData.organization} onChangeText={(v) => handleInputChange('organization', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nursing Registration Number</Text>
                      <TextInput style={styles.input} placeholder="Enter registration number" value={formData.registrationNumber} onChangeText={(v) => handleInputChange('registrationNumber', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Highest Qualification</Text>
                      <TextInput style={styles.input} placeholder="e.g., GNM, B.Sc Nursing, M.Sc Nursing" value={formData.highestQualification} onChangeText={(v) => handleInputChange('highestQualification', v)} placeholderTextColor="#999" />
                    </View>
                  </>
                )}
                {step === 3 && (
                  <>
                    <Text style={styles.sectionTitle}>📍 Location</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>City *</Text>
                      <TextInput style={styles.input} placeholder="Enter your city" value={formData.city} onChangeText={(v) => handleInputChange('city', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>State *</Text>
                      <TextInput style={styles.input} placeholder="e.g., Maharashtra, Delhi, Karnataka" value={formData.state} onChangeText={(v) => handleInputChange('state', v)} placeholderTextColor="#999" />
                    </View>
                    <View style={styles.successBox}>
                      <Text style={styles.successText}>🎉 You're almost there! Complete your profile to unlock exclusive courses, events, and rewards.</Text>
                    </View>
                  </>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                  {step > 1 && (
                    <TouchableOpacity style={[styles.button, styles.backButton, { flex: 1, marginRight: 8 }]} onPress={handleBack} disabled={loading}>
                      <Text style={[styles.primaryButtonText, { color: '#666' }]}>← Back</Text>
                    </TouchableOpacity>
                  )}
                  {step < 3 && (
                    <TouchableOpacity style={[styles.button, styles.primaryButton, { flex: 1 }]} onPress={handleNext} disabled={loading}>
                      <Text style={styles.primaryButtonText}>Continue →</Text>
                    </TouchableOpacity>
                  )}
                  {step === 3 && (
                    <TouchableOpacity style={[styles.button, styles.primaryButton, { flex: 1 }]} onPress={handleSubmit} disabled={loading}>
                      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Complete Profile</Text>}
                    </TouchableOpacity>
                  )}
                </View>

                {/* Skip button for Step 2 */}
                {step === 2 && (
                  <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkip} disabled={loading}>
                    <Text style={styles.skipButtonText}>Skip for Now</Text>
                  </TouchableOpacity>
                )}
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
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: NEON_COLORS.neonCyan,
    borderRadius: 3,
  },
  helperText: {
    fontSize: 12,
    color: NEON_COLORS.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  successText: {
    fontSize: 13,
    color: '#10B981',
    lineHeight: 20,
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
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  primaryButton: {
    backgroundColor: NEON_COLORS.neonPurple,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  skipButton: {
    backgroundColor: 'transparent',
    marginTop: -8,
  },
  skipButtonText: {
    color: NEON_COLORS.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
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