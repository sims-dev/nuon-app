// API Integration Helper - Copy this code to new UI screens

import api, { catalogAPI, courseAPI, bookingAPI, mentorAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// Login Function - Add to LoginScreen
export const handleLogin = async (email, password, navigation) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    // Log the token for debugging (copy this from Metro/console)
    console.log('JWT Token:', token);

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register Function - Add to RegisterScreen
export const handleRegister = async (userData, navigation) => {
  try {
  await api.post('/register', userData);
    navigation.replace('Login');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Load Catalog - Add to CatalogScreen
export const loadCatalog = async () => {
  try {
    const response = await catalogAPI.getCatalog();
    return response.data || [];
  } catch (error) {
    console.error('Catalog error:', error);
    return [];
  }
};

// Enhanced Load Mentors - Supports forced refresh
export const loadMentors = async (forceRefresh = false) => {
  try {
    if (forceRefresh) {
      console.log('Forcing mentor data refresh...');
    } else {
      console.log('Loading mentor data...');
    }

    const response = await fetchPublicMentors();
    console.log(`Mentor data loaded: ${response.length} mentors fetched.`);
    return response;
  } catch (error) {
    console.error('Mentors error:', error);
    return [];
  }
};

// Logout Function - Add to any screen with logout
export const handleLogout = async (navigation) => {
  await AsyncStorage.clear();
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  );
};