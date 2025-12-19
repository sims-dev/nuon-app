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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { AuthContext } from '../contexts/AuthContext';
import api, { authAPI } from '../services/api';

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
    // Load existing data from user context
    if (authUser) {
      setFormData({
        fullName: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phoneNumber || '',
        specialization: authUser.specialization || '',
        experience: authUser.experience || '',
        currentWorkplace: authUser.organization || '',
        city: authUser.city || '',
        state: authUser.state || '',
        registrationNumber: authUser.registrationNumber || '',
        highestQualification: authUser.highestQualification || '',
      });
    }
  }, [authUser]);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value || '' });
  };

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'specialization', 'experience'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Email, Specialization, Experience)');
      return;
    }

    // Validate email format
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
        experience: formData.experience,
        organization: formData.currentWorkplace,
        city: formData.city,
        state: formData.state,
        registrationNumber: formData.registrationNumber,
        highestQualification: formData.highestQualification,
        location: [formData.city, formData.state].filter(Boolean).join(', '),
      };

      const response = await authAPI.updateProfile(payload);

      if (response.data?.success) {
        const updatedUser = response.data.user || response.data.profile;
        updateUser(updatedUser);

        // Check if professional info is complete
        const isProfessionalComplete = formData.currentWorkplace && formData.registrationNumber && formData.highestQualification;
        if (isProfessionalComplete) {
          updatedUser.profileIncomplete = false;
        }

        // Check if profile is now complete
        const isProfileComplete = updatedUser.isProfileComplete || (formData.currentWorkplace && formData.registrationNumber && formData.highestQualification);

        if (isProfileComplete) {
          // Profile is complete, go to main screen
          Alert.alert('Success', 'Profile completed successfully!', [
            { text: 'Continue', onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }]
              });
            }}
          ]);
        } else {
          // Profile still incomplete, go back
          Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
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
            <SvgXml xml={chevronLeftSvg} width={20} height={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        {authUser?.profileIncomplete && (
          <View style={styles.incompleteBannerSmall}>
            <Text style={styles.incompleteBannerTextSmall}>
              Complete your professional information
            </Text>
          </View>
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
              <Text style={styles.label}>Email Address *</Text>
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., General Nursing, Critical Care"
                  value={formData.specialization}
                  onChangeText={(value) => updateFormData('specialization', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years of Experience *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 0-1, 1-3, 3-5, 5-10, 10+"
                  value={formData.experience}
                  onChangeText={(value) => updateFormData('experience', value)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Professional Information */}
        <View style={[styles.card, !isProfessionalInfoComplete && styles.incompleteCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.titleContainer}>
                <View style={styles.titleWithIcon}>
                  <SvgXml xml={briefcaseSvg} width={20} height={20} color="#2563EB" />
                  <Text style={styles.cardTitle}>Professional Information</Text>
                </View>
                {!isProfessionalInfoComplete && (
                  <Text style={styles.helperText}>
                    Complete this section to unlock all features and book sessions
                  </Text>
                )}
              </View>
              {!isProfessionalInfoComplete && (
                <View style={styles.incompleteBadge}>
                  <Text style={styles.incompleteBadgeText}>Incomplete</Text>
                </View>
              )}
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., GNM, B.Sc Nursing, M.Sc Nursing"
                  value={formData.highestQualification}
                  onChangeText={(value) => updateFormData('highestQualification', value)}
                />
              </View>
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Maharashtra, Delhi, Karnataka"
                  value={formData.state}
                  onChangeText={(value) => updateFormData('state', value)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  incompleteBannerSmall: {
    backgroundColor: '#F97316',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  incompleteBannerTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  incompleteCard: {
    borderWidth: 2,
    borderColor: '#fed7aa',
    backgroundColor: '#FFFFFF',
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
    marginBottom: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileEditScreen;