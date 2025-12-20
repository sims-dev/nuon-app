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
import { Picker } from '@react-native-picker/picker';
import { User, Briefcase, MapPin } from 'lucide-react-native';



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
  const { updateUser, token, setToken, user: authUser } = useContext(AuthContext);
  // Defensive: ensure route.params exists and is an object
  const params = (route && route.params && typeof route.params === 'object') ? route.params : {};
  const initialUser = authUser || params.user || {};
  const paramToken = params.token;
  const isNewUser = params.isNewUser || false;
  const initialStep = params.step || 1;

  // Ensure token is set in context if passed via navigation
  useEffect(() => {
    if (paramToken && !token) {
      console.log('Setting token from navigation params:', paramToken);
      setToken(paramToken);
      // Persist token to AsyncStorage for consistency
      AsyncStorage.setItem('token', paramToken).catch(() => {});
    }
  }, [paramToken, token, setToken]);


  // Initialize form data - prefill with existing data if available
  useEffect(() => {
    console.log('Profile setup initialized with user data:', initialUser);
    if (initialUser && Object.keys(initialUser).length > 0) {
      setFormData({
        fullName: initialUser?.name || '',
        email: initialUser?.email || '',
        specialization: initialUser?.specialization || '',
        experience: initialUser?.experience?.toString() || '',
        currentWorkplace: initialUser?.hospital || initialUser?.organization || '',
        city: initialUser?.city || '',
        state: initialUser?.state || '',
        registrationNumber: initialUser?.registrationNumber || '',
        highestQualification: initialUser?.qualification || '',
      });
    }
  }, [initialUser?.id]); // Only depend on user ID to prevent infinite loops

  // Multi-step state - Now 3 steps: Personal, Professional (skippable), Location
  const [step, setStep] = useState(initialStep); // 1: Personal, 2: Professional (skippable), 3: Location
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    city: '',
    state: '',
    registrationNumber: '',
    highestQualification: '',
  });
  const [loading, setLoading] = useState(false);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // For new user registration, we don't need a token initially
  // The token will be generated after successful registration

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = async () => {
    // Validation for Step 1 - Personal Information
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.specialization || !formData.experience) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    }

    // Save partial data to backend
    try {
      const partialPayload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        specialization: formData.specialization.trim(),
        experience: parseInt(formData.experience) || 0,
        currentWorkplace: formData.currentWorkplace?.trim() || '',
        registrationNumber: formData.registrationNumber?.trim() || '',
        highestQualification: formData.highestQualification?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        organization: formData.currentWorkplace?.trim() || '',
        location: [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', '),
      };

      // Use PUT /profile endpoint for updates
      await api.put('/profile', partialPayload, {
        timeout: 10000
      });

      console.log('Partial profile data saved successfully');
    } catch (error) {
      console.error('Error saving partial data:', error);
      // Don't block navigation if save fails, just log it
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = async () => {
    try {
      // Save partial profile data to AsyncStorage
      await AsyncStorage.setItem('nurseProfile', JSON.stringify(formData));
      await AsyncStorage.setItem('profileIncomplete', 'true');

      // Update user context with incomplete profile
      updateUser({ ...initialUser, ...formData, name: formData.fullName, profileIncomplete: true });

      // Navigate to main screen
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Save profile data to AsyncStorage
      await AsyncStorage.setItem('nurseProfile', JSON.stringify(formData));

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: initialUser?.phoneNumber || '', // Store phone number from OTP auth
        specialization: formData.specialization.trim(),
        experience: parseInt(formData.experience) || 0,
        currentWorkplace: formData.currentWorkplace?.trim() || '',
        registrationNumber: formData.registrationNumber?.trim() || '',
        highestQualification: formData.highestQualification?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        location: [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', '),
      };

      // Check if profile is complete
      const isProfileComplete = Boolean(
        formData.fullName &&
        formData.email &&
        formData.specialization &&
        formData.experience &&
        formData.currentWorkplace &&
        formData.registrationNumber &&
        formData.highestQualification &&
        formData.city &&
        formData.state
      );

      if (!isProfileComplete) {
        await AsyncStorage.setItem('profileIncomplete', 'true');
      } else {
        await AsyncStorage.removeItem('profileIncomplete');
      }

      // Use /profile endpoint for profile completion
      const response = await api.put('/profile', payload, {
        timeout: 10000
      });

      if (response.data?.success || response.status === 200) {
        const updatedUser = response.data?.user || { ...initialUser, ...payload };

        updatedUser.profileIncomplete = !isProfileComplete;

        // Store updated user data
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        // Update auth context
        updateUser({ ...updatedUser, profileIncomplete: !isProfileComplete });

        setLoading(false);

        if (!isProfileComplete) {
          Alert.alert(
            'Profile Partially Complete',
            'You can complete your professional details anytime from your profile.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Success', 'Registration complete! Welcome to Neon Club!');
        }

        // Navigate to dashboard
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
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.header}>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
          <Text style={styles.headerSubtitle}>Help us personalize your experience</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
        </LinearGradient>

        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
           <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <User size={20} color="#6366f1" style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>Personal Information</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Full Name *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChangeText={(value) => updateFormData('fullName', value)}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email Address *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChangeText={(value) => updateFormData('email', value)}
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Specialization *</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={formData.specialization}
                          onValueChange={(value) => updateFormData('specialization', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select your specialization" value="" />
                          <Picker.Item label="General Nursing" value="general" />
                          <Picker.Item label="Critical Care" value="critical-care" />
                          <Picker.Item label="Pediatric Nursing" value="pediatric" />
                          <Picker.Item label="Emergency Nursing" value="emergency" />
                          <Picker.Item label="Oncology" value="oncology" />
                          <Picker.Item label="Cardiac Care" value="cardiac" />
                          <Picker.Item label="Neonatal Care" value="neonatal" />
                          <Picker.Item label="Psychiatric Nursing" value="psychiatric" />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Years of Experience *</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={formData.experience}
                          onValueChange={(value) => updateFormData('experience', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select experience" value="" />
                          <Picker.Item label="0-1 years" value="0-1" />
                          <Picker.Item label="1-3 years" value="1-3" />
                          <Picker.Item label="3-5 years" value="3-5" />
                          <Picker.Item label="5-10 years" value="5-10" />
                          <Picker.Item label="10+ years" value="10+" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 2: Professional Information */}
              {step === 2 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Briefcase size={20} color="#6366f1" style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>Professional Information</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Current Workplace *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Hospital/Clinic name"
                        value={formData.currentWorkplace}
                        onChangeText={(value) => updateFormData('currentWorkplace', value)}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nursing Registration Number *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter registration number"
                        value={formData.registrationNumber}
                        onChangeText={(value) => updateFormData('registrationNumber', value)}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Highest Qualification *</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={formData.highestQualification}
                          onValueChange={(value) => updateFormData('highestQualification', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select qualification" value="" />
                          <Picker.Item label="GNM (General Nursing & Midwifery)" value="gnm" />
                          <Picker.Item label="B.Sc Nursing" value="bsc" />
                          <Picker.Item label="Post B.Sc Nursing" value="post-bsc" />
                          <Picker.Item label="M.Sc Nursing" value="msc" />
                          <Picker.Item label="Ph.D in Nursing" value="phd" />
                          <Picker.Item label="Diploma in Nursing" value="diploma" />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <MapPin size={20} color="#6366f1" style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>Location</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>City *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your city"
                        value={formData.city}
                        onChangeText={(value) => updateFormData('city', value)}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>State *</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={formData.state}
                          onValueChange={(value) => updateFormData('state', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select your state" value="" />
                          <Picker.Item label="Andhra Pradesh" value="andhra-pradesh" />
                          <Picker.Item label="Delhi" value="delhi" />
                          <Picker.Item label="Karnataka" value="karnataka" />
                          <Picker.Item label="Kerala" value="kerala" />
                          <Picker.Item label="Maharashtra" value="maharashtra" />
                          <Picker.Item label="Tamil Nadu" value="tamil-nadu" />
                          <Picker.Item label="Telangana" value="telangana" />
                          <Picker.Item label="West Bengal" value="west-bengal" />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      </View>
                    </View>

                    <View style={styles.successBox}>
                      <Text style={styles.successText}>
                        You're almost there! Complete your profile to unlock exclusive courses, events, and rewards.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {step < totalSteps ? 'Continue' : 'Complete Profile'}
                  </Text>
                )}
              </TouchableOpacity>

              {step === 2 && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  disabled={loading}
                >
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
              )}

              {step > 1 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  disabled={loading}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
       </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  stepText: {
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 20, // Space for footer
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16, // Increased padding for better touch targets
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    minHeight: 52, // Ensure minimum height for touch targets
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    minHeight: 52, // Ensure minimum height for touch targets
  },
  picker: {
    height: 52, // Increased height for better usability
    color: '#1f2937',
  },
  successBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  successText: {
    fontSize: 14,
    color: '#065f46',
    lineHeight: 20,
  },
  footer: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 44,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 8,
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    minHeight: 44,
  },
  backButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
export default ProfileSetupScreen;