
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const checkProfileCompletion = async () => {
  try {
    // First try to get fresh data from backend
    try {
      const response = await api.get('/user/me');
      if (response.data?.success && response.data?.user) {
        const user = response.data.user;

        // Update localStorage with fresh data
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Check if backend has marked profile as complete
        if (user.isProfileComplete === true) {
          return {
            isComplete: true,
            missingFields: [],
            profileIncomplete: false
          };
        }

        // Check individual required fields
        const missingFields = [];
        if (!user.organization && !user.hospital && !user.currentWorkplace) missingFields.push('Current Workplace');
        if (!user.registrationNumber) missingFields.push('Registration Number');
        if (!user.qualification && !user.highestQualification) missingFields.push('Highest Qualification');

        return {
          isComplete: missingFields.length === 0,
          missingFields,
          profileIncomplete: missingFields.length > 0
        };
      }
    } catch (apiError) {
      // API call failed, falling back to localStorage
    }

    // Fallback to localStorage if API fails
    const userData = await AsyncStorage.getItem('user');
    if (!userData) return { isComplete: false, missingFields: ['Current Workplace', 'Registration Number', 'Highest Qualification'] };

    const user = JSON.parse(userData);

    // First check if backend has marked profile as complete
    if (user.isProfileComplete === true) {
      return {
        isComplete: true,
        missingFields: [],
        profileIncomplete: false
      };
    }

    // Fallback: check individual required fields
    const missingFields = [];
    if (!user.organization && !user.hospital && !user.currentWorkplace) missingFields.push('Current Workplace');
    if (!user.registrationNumber) missingFields.push('Registration Number');
    if (!user.qualification && !user.highestQualification) missingFields.push('Highest Qualification');

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      profileIncomplete: missingFields.length > 0
    };
  } catch (error) {
    return { isComplete: false, missingFields: ['Current Workplace', 'Registration Number', 'Highest Qualification'] };
  }
};

export const setProfileIncompleteFlag = async (incomplete) => {
  try {
    await AsyncStorage.setItem('profileIncomplete', JSON.stringify(incomplete));
  } catch (error) {
    // Error setting profile incomplete flag
  }
};

export const getProfileIncompleteFlag = async () => {
  try {
    const flag = await AsyncStorage.getItem('profileIncomplete');
    return flag ? JSON.parse(flag) : false;
  } catch (error) {
    return false;
  }
};

export const refreshProfileData = async () => {
  try {
    const response = await api.get('/user/me');
    if (response.data?.success && response.data?.user) {
      const freshUser = response.data.user;
      await AsyncStorage.setItem('user', JSON.stringify(freshUser));
      return freshUser;
    }
  } catch (error) {
    // Failed to refresh profile data
  }
  return null;
};