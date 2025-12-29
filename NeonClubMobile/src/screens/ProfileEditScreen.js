import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { AuthContext } from '../contexts/AuthContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../screens/ui/select';
import api from '../services/api';
import { refreshProfileData } from '../utils/profileUtils';
import Badge from '../components/Badge';

console.log('ProfileEditScreen: Module loaded successfully');

// SVG Icons
const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const building2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.174 0l-3.58 2.687a.5.5 0 0 1-.81-.47l1.515-8.526"/><circle cx="12" cy="8" r="6"/></svg>`;
const saveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>`;

export function ProfileEditScreen({ navigation, route }) {
  const { user: authUser, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    city: '',
    state: '',
    registrationNumber: '',
    highestQualification: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing data from user context (prefill for editing)
    if (authUser) {
      setFormData({
        fullName: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phoneNumber || '',
        specialization: authUser.specialization || '',
        experience: authUser.experience?.toString() || '',
        currentWorkplace: authUser.currentWorkplace || authUser.organization || authUser.hospital || '',
        city: authUser.city || '',
        state: authUser.state || '',
        registrationNumber: authUser.registrationNumber || '',
        highestQualification: authUser.highestQualification || authUser.qualification || '',
      });
    }
  }, [authUser]);


  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value || '' });
  };


  const handleSave = async () => {
    // Validate required fields (personal information)
    const requiredFields = ['fullName', 'email', 'specialization', 'experience'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in all required fields: ${missingFields.map(f => f === 'fullName' ? 'Name' : f === 'email' ? 'Email' : f === 'specialization' ? 'Specialization' : 'Experience').join(', ')}`);
      return;
    }

    // Validate email format if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        currentWorkplace: formData.currentWorkplace,
        registrationNumber: formData.registrationNumber,
        highestQualification: formData.highestQualification,
        city: formData.city,
        state: formData.state,
        organization: formData.currentWorkplace,
        location: [formData.city, formData.state].filter(Boolean).join(', '),
      };

      // Try to save to backend first
      try {
        const response = await api.put('/profile', payload);

        if (response.data?.success) {
          console.log('Profile saved to backend successfully');

          // Refresh profile data from backend
          const freshUser = await refreshProfileData();
          if (freshUser) {
            // Check if profile is complete (all required fields including professional info)
            const isProfileComplete = formData.fullName &&
                                     formData.specialization &&
                                     formData.experience &&
                                     formData.currentWorkplace &&
                                     formData.registrationNumber &&
                                     formData.highestQualification;

            // Update profile completion status
            freshUser.isProfileComplete = isProfileComplete;
            freshUser.profileIncomplete = !isProfileComplete;
            updateUser(freshUser);

            // Update localStorage to sync
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));

            if (isProfileComplete) {
              // Profile is complete, navigate to main screen
              Alert.alert('Success', 'Profile completed successfully! You can now book sessions and access all features.', [
                { text: 'Continue', onPress: () => {
                  navigation.navigate('Main');
                }}
              ]);
            } else {
              // Profile still incomplete, go back to profile screen
              Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            }
          } else {
            throw new Error('Failed to refresh profile data');
          }
        } else {
          throw new Error(response.data?.message || 'Update failed');
        }
      } catch (apiError) {
        console.log('Backend save failed, falling back to local storage:', apiError.message);

        // Fallback: save locally
        const updatedUser = {
          ...authUser,
          name: payload.name,
          email: payload.email,
          phoneNumber: payload.phone,
          specialization: payload.specialization,
          experience: payload.experience,
          currentWorkplace: payload.currentWorkplace,
          hospital: payload.currentWorkplace,
          organization: payload.currentWorkplace,
          city: payload.city,
          state: payload.state,
          registrationNumber: payload.registrationNumber,
          highestQualification: payload.highestQualification,
          qualification: payload.highestQualification,
          location: payload.location,
          profilePicture: authUser?.profilePicture || '',
        };

        // Check profile completion status
        const isProfileComplete = formData.fullName &&
                                 formData.specialization &&
                                 formData.experience &&
                                 formData.currentWorkplace &&
                                 formData.registrationNumber &&
                                 formData.highestQualification;

        updatedUser.isProfileComplete = isProfileComplete;
        updatedUser.profileIncomplete = !isProfileComplete;

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        updateUser(updatedUser);

        Alert.alert('Success', 'Profile updated locally (will sync when online)', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isProfessionalInfoComplete = formData.currentWorkplace && formData.registrationNumber && formData.highestQualification;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2563EB', '#1D4ED8', '#1E40AF']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        {authUser?.profileIncomplete && (
          <Badge variant="orange" style={styles.incompleteBadgeHeader}>
            Complete your professional information
          </Badge>
        )}
      </LinearGradient>

      <View style={styles.content}>
        {/* Personal Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <SvgXml xml={userSvg} width={20} height={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialization *</Text>
              <Select
                value={formData.specialization}
                onValueChange={(value) => updateFormData('specialization', value)}
              >
                <SelectTrigger style={{ height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
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

            <View style={styles.inputGroup}>
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

        {/* Professional Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.titleWithIcon}>
                <SvgXml xml={briefcaseSvg} width={20} height={20} color="#2563EB" />
                <Text style={[styles.cardTitle, { color: '#282623ff' }]}>Professional Information</Text>
              </View>
  
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Workplace</Text>
              <View style={styles.inputContainer}>
                <SvgXml xml={building2Svg} width={20} height={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Hospital/Clinic name"
                  value={formData.currentWorkplace}
                  onChangeText={(value) => updateFormData('currentWorkplace', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nursing Registration Number</Text>
              <View style={styles.inputContainer}>
                <SvgXml xml={awardSvg} width={20} height={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Enter registration number"
                  value={formData.registrationNumber}
                  onChangeText={(value) => updateFormData('registrationNumber', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Highest Qualification</Text>
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

        {/* Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <SvgXml xml={mapPinSvg} width={20} height={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your city"
                  value={formData.city}
                  onChangeText={(value) => updateFormData('city', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
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
          </View>
        </View>

        {/* Save Button */}
        <LinearGradient
          colors={['#2563eb', '#9333ea']}
          style={styles.saveButton}
        >
          <TouchableOpacity
            style={styles.saveButtonTouchable}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <SvgXml xml={saveSvg} width={20} height={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
  },
  incompleteBadgeHeader: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  incompleteCard: {
    borderWidth: 2,
    borderColor: '#fed7aa',
    backgroundColor: 'rgba(255, 247, 237, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  incompleteBadge: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  incompleteBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 14,
    color: '#ea580c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardContent: {
    // No specific styles
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 48,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  saveButton: {
    borderRadius: 28,
    height: 56,
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});


export default ProfileEditScreen;