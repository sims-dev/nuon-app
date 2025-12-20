import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkProfileCompletion = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) return { isComplete: false, missingFields: ['Current Workplace', 'Registration Number', 'Highest Qualification'] };

    const user = JSON.parse(userData);

    const missingFields = [];
    if (!user.organization) missingFields.push('Current Workplace');
    if (!user.registrationNumber) missingFields.push('Registration Number');
    if (!user.qualification) missingFields.push('Highest Qualification');

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      profileIncomplete: missingFields.length > 0
    };
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return { isComplete: false, missingFields: ['Current Workplace', 'Registration Number', 'Highest Qualification'] };
  }
};

export const setProfileIncompleteFlag = async (incomplete) => {
  try {
    await AsyncStorage.setItem('profileIncomplete', JSON.stringify(incomplete));
  } catch (error) {
    console.error('Error setting profile incomplete flag:', error);
  }
};

export const getProfileIncompleteFlag = async () => {
  try {
    const flag = await AsyncStorage.getItem('profileIncomplete');
    return flag ? JSON.parse(flag) : false;
  } catch (error) {
    console.error('Error getting profile incomplete flag:', error);
    return false;
  }
};