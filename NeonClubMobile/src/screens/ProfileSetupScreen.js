import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import * as Progress from 'react-native-progress';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { authAPI } from '../services/api';
import { User, Briefcase, MapPin, Building2, Award, ChevronRight } from 'lucide-react-native';
import { AuthContext } from '../contexts/AuthContext';

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const { updateUser, user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    registrationNumber: '',
    highestQualification: '',
    city: '',
    state: '',
  });

  // Prefill form data from user context if user has incomplete profile
  useEffect(() => {
    if (user && user.profileIncomplete) {
      // Map experience number back to string
      const experienceMapReverse = {
        1: '0-1',
        2: '1-3',
        4: '3-5',
        7: '5-10',
        12: '10+'
      };

      const prefilledData = {
        fullName: user.name || '',
        email: user.email || '',
        specialization: user.specialization || '',
        experience: experienceMapReverse[user.experience] || '',
        currentWorkplace: user.organization || user.currentWorkplace || '',
        registrationNumber: user.registrationNumber || '',
        highestQualification: user.highestQualification || user.qualification || '',
        city: user.city || '',
        state: user.state || '',
      };

      setFormData(prefilledData);

      // Determine starting step based on available data
      let startingStep = 1;
      if (user.name && user.email && user.specialization && user.experience !== undefined) {
        startingStep = 2; // Step 1 complete
      }
      if (user.organization && user.registrationNumber && user.highestQualification) {
        startingStep = 3; // Step 2 complete
      }

      setStep(startingStep);
    }
  }, [user]);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!formData.fullName?.trim()) return 'Full name is required';
        if (!formData.email?.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
        if (!formData.specialization) return 'Specialization is required';
        if (!formData.experience) return 'Experience is required';
        break;
      case 2:
        if (!formData.currentWorkplace?.trim()) return 'Current workplace is required';
        if (!formData.registrationNumber?.trim()) return 'Registration number is required';
        if (!formData.highestQualification) return 'Highest qualification is required';
        break;
      case 3:
        if (!formData.city?.trim()) return 'City is required';
        if (!formData.state) return 'State is required';
        break;
    }
    return null;
  };

  const handleNext = async () => {
    const validationError = validateStep(step);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        // Map experience string to number
        const experienceMap = {
          '0-1': 1,
          '1-3': 2,
          '3-5': 4,
          '5-10': 7,
          '10+': 12
        };

        const payload = {
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: user?.phoneNumber || '',
          specialization: formData.specialization,
          experience: experienceMap[formData.experience] || 0,
          organization: formData.currentWorkplace.trim(),
          city: formData.city.trim(),
          state: formData.state,
          location: [formData.city.trim(), formData.state].filter(Boolean).join(', '),
          highestQualification: formData.highestQualification,
          registrationNumber: formData.registrationNumber.trim(),
          currentWorkplace: formData.currentWorkplace.trim(),
        };

        console.log('[ProfileSetup] Updating profile with payload:', payload);
        const response = await authAPI.updateProfile(payload);
        console.log('[ProfileSetup] Update profile response:', response.data);

        // Mark profile as complete
        const userWithCompleteProfile = {
          ...response.data.user,
          profileIncomplete: false,
          isProfileComplete: true
        };

        console.log('[ProfileSetup] User with complete profile:', userWithCompleteProfile);

        // Update user in AuthContext (this will also update AsyncStorage)
        console.log('[ProfileSetup] Calling updateUser with:', JSON.stringify(userWithCompleteProfile, null, 2));
        updateUser(userWithCompleteProfile);
        console.log('[ProfileSetup] updateUser called');

        // Update tokens if provided
        if (response.data.accessToken) {
          await AsyncStorage.setItem('token', response.data.accessToken);
        }
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        }

        // Navigate to Main
        console.log('[ProfileSetup] Navigating to Main');
        navigation.navigate('Main');
        console.log('[ProfileSetup] Navigation reset called');
      } catch (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', error.message || 'Failed to complete profile');
        // Still navigate to Main even on error to allow access
        navigation.navigate('Main');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = async () => {
    try {
      // Validate step 1 data
      const validationError = validateStep(1);
      if (validationError) {
        Alert.alert('Validation Error', validationError);
        return;
      }

      // Map experience string to number
      const experienceMap = {
        '0-1': 1,
        '1-3': 2,
        '3-5': 4,
        '5-10': 7,
        '10+': 12
      };

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: user?.phoneNumber || '',
        specialization: formData.specialization,
        experience: experienceMap[formData.experience] || 0,
      };

      console.log('[ProfileSetup] Saving step 1 data on skip:', payload);
      const response = await authAPI.updateProfile(payload);
      console.log('[ProfileSetup] Skip update response:', response.data);

      // Update user in AuthContext with partial data
      const userWithPartialProfile = {
        ...response.data.user,
        profileIncomplete: true,
        isProfileComplete: false
      };

      console.log('[ProfileSetup] Calling updateUser with partial profile:', JSON.stringify(userWithPartialProfile, null, 2));
      updateUser(userWithPartialProfile);

      // Update tokens if provided
      if (response.data.accessToken) {
        await AsyncStorage.setItem('token', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }

      navigation.navigate('Main');
    } catch (error) {
      console.error('Skip profile error:', error);
      Alert.alert('Error', error.message || 'Failed to skip profile setup');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}>
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>Complete Your Profile</Text>
        <Text style={{ color: '#BFDBFE', fontSize: 16, marginBottom: 24 }}>Help us personalize your experience</Text>
        <Progress.Bar progress={step / totalSteps} height={8} color="#60A5FA" />
        <Text style={{ color: '#BFDBFE', fontSize: 14, marginTop: 8 }}>Step {step} of {totalSteps}</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 24 }}>
        {step === 1 && (
          <View style={styles.card}>
            <View style={{ paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <User size={20} color="#3B82F6" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6', marginLeft: 8 }}>Personal Information</Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF' }}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF' }}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Specialization *</Text>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => updateFormData('specialization', value)}
                >
                  <SelectTrigger style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Nursing</SelectItem>
                    <SelectItem value="critical-care">Critical Care</SelectItem>
                    <SelectItem value="pediatric">Pediatric Nursing</SelectItem>
                    <SelectItem value="emergency">Emergency Nursing</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="cardiac">Cardiac Care</SelectItem>
                    <SelectItem value="neonatal">Neonatal Care</SelectItem>
                    <SelectItem value="psychiatric">Psychiatric Nursing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Years of Experience *</Text>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => updateFormData('experience', value)}
                >
                  <SelectTrigger style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <View style={{ paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Briefcase size={20} color="#3B82F6" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6', marginLeft: 8 }}>Professional Information</Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Current Workplace *</Text>
                <View style={{ position: 'relative' }}>
                  <Building2 style={{ position: 'absolute', left: 12, top: 12, height: 20, width: 20, color: '#9CA3AF' }} />
                  <TextInput
                    style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, paddingLeft: 40, backgroundColor: '#FFFFFF' }}
                    placeholder="Hospital/Clinic name"
                    value={formData.currentWorkplace}
                    onChangeText={(value) => updateFormData('currentWorkplace', value)}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Nursing Registration Number *</Text>
                <View style={{ position: 'relative' }}>
                  <Award style={{ position: 'absolute', left: 12, top: 12, height: 20, width: 20, color: '#9CA3AF' }} />
                  <TextInput
                    style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, paddingLeft: 40, backgroundColor: '#FFFFFF' }}
                    placeholder="Enter registration number"
                    value={formData.registrationNumber}
                    onChangeText={(value) => updateFormData('registrationNumber', value)}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Highest Qualification *</Text>
                <Select
                  value={formData.highestQualification}
                  onValueChange={(value) => updateFormData('highestQualification', value)}
                >
                  <SelectTrigger style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gnm">GNM (General Nursing & Midwifery)</SelectItem>
                    <SelectItem value="bsc">B.Sc Nursing</SelectItem>
                    <SelectItem value="post-bsc">Post B.Sc Nursing</SelectItem>
                    <SelectItem value="msc">M.Sc Nursing</SelectItem>
                    <SelectItem value="phd">Ph.D in Nursing</SelectItem>
                    <SelectItem value="diploma">Diploma in Nursing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <View style={{ paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={20} color="#3B82F6" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6', marginLeft: 8 }}>Location</Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF' }}
                  placeholder="Enter your city"
                  value={formData.city}
                  onChangeText={(value) => updateFormData('city', value)}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>State *</Text>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData('state', value)}
                >
                  <SelectTrigger style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </View>

              <View style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 16, marginTop: 24 }}>
                <Text style={{ fontSize: 14, color: '#1E40AF' }}>
                  🎉 You're almost there! Complete your profile to unlock exclusive courses, events, and rewards.
                </Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <TouchableOpacity style={{ width: '100%', height: 48, borderRadius: 24, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 8, flexDirection: 'row' }} onPress={handleNext}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            {step < totalSteps ? 'Continue' : 'Complete Profile'}
          </Text>
          {step < totalSteps && <ChevronRight size={20} color="white" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        {step === 2 && (
          <TouchableOpacity style={{ width: '100%', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#6B7280', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }} onPress={handleSkip}>
            <Text style={{ color: '#6B7280', fontSize: 16 }}>Skip for Now</Text>
          </TouchableOpacity>
        )}

        {step > 1 && (
          <TouchableOpacity style={{ width: '100%', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }} onPress={handleBack}>
            <Text style={{ color: '#374151', fontSize: 16 }}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  selectTrigger: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  successMessage: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  successText: {
    fontSize: 14,
    color: '#10B981',
  },
  footer: {
    marginTop: 24,
  },
  button: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default ProfileSetupScreen;