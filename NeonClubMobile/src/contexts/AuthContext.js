import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { probeAndFixBase } from '../services/api';
import socketService from '../services/socket';
import { DeviceEventEmitter } from 'react-native';

export const AuthContext = createContext({
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
  setToken: () => {},
  setRefreshToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [refreshToken, setRefreshTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    // Load existing auth data if available, otherwise start fresh for onboarding
    const loadAuth = async () => {
      if (loaded.current) {
        setLoading(false);
        return;
      }
      loaded.current = true;
      try {
        // Support both mobile ('token') and web-style ('accessToken') storage keys
        let token = await AsyncStorage.getItem('token');
        if (!token) {
          token = await AsyncStorage.getItem('accessToken');
        }
        let refreshToken = await AsyncStorage.getItem('refreshToken');
        // user may be stored under 'user' (mobile) or 'profile' (older flows)
        let userStr = await AsyncStorage.getItem('user');
        if (!userStr) {
          userStr = await AsyncStorage.getItem('profile');
        }

        if (token) {
           // Always try to fetch fresh user data from server if we have a token (skip for test tokens)
           if (!token.startsWith('test_')) {
             try {
               console.log('[AuthContext] Fetching fresh user data from server...');
               // Use Promise.race to manually timeout the request
               const profilePromise = api.get('/user/me');
               const timeoutPromise = new Promise((_, reject) =>
                 setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
               );
               const profileResponse = await Promise.race([profilePromise, timeoutPromise]);
               if (profileResponse.data?.success && profileResponse.data?.user) {
                 const freshUser = profileResponse.data.user;
                 setTokenState(token);
                 setRefreshTokenState(refreshToken);
                 setUser(freshUser);
                 // Update stored user data with fresh data
                 await AsyncStorage.setItem('user', JSON.stringify(freshUser));
                 api.defaults.headers.common.Authorization = `Bearer ${token}`;
                 console.log('[AuthContext] Loaded fresh user data from server');
                 // Ensure profileIncomplete is set
                 updateUser(freshUser);
                 return;
               }
             } catch (error) {
               console.warn('[AuthContext] Failed to fetch fresh user data, using stored data:', error.message);
               // On profile API failure, set profileIncomplete to true but keep user
               setUser(prev => ({ ...prev, profileIncomplete: true }));
             }
           }

           // Fallback to stored user data if server fetch fails
           if (userStr) {
             const user = JSON.parse(userStr);
             setTokenState(token);
             setRefreshTokenState(refreshToken);
             setUser(user);
             api.defaults.headers.common.Authorization = `Bearer ${token}`;
             console.log('[AuthContext] Loaded stored auth data as fallback');
             // Ensure profileIncomplete is set
             updateUser(user);
           } else {
             console.log('[AuthContext] Token exists but no user data available');
           }
         } else {
           console.log('[AuthContext] No existing auth data, starting fresh');
         }
      } catch (error) {
        console.error('[AuthContext] Error loading auth data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();

    // Listen for token refresh events
    const tokenRefreshListener = DeviceEventEmitter.addListener('tokenRefreshed', async (newToken) => {
      setTokenState(newToken);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      socketService.updateToken(newToken);
      // Fetch fresh user data on token refresh
      setLoading(true);
      try {
        const profileResponse = await api.get('/user/me');
        if (profileResponse.data?.success && profileResponse.data?.user) {
          const freshUser = profileResponse.data.user;
          setUser(freshUser);
          await AsyncStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (error) {
        console.warn('Failed to fetch user on token refresh:', error);
      } finally {
        setLoading(false);
      }
    });

    // Listen for token cleared events
    const tokenClearedListener = DeviceEventEmitter.addListener('tokenCleared', () => {
      setTokenState(null);
      setRefreshTokenState(null);
      setUser(null);
      delete api.defaults.headers.common.Authorization;
      socketService.disconnect();
    });

    return () => {
      tokenRefreshListener.remove();
      tokenClearedListener.remove();
    };
  }, []);

  const signIn = async (credentials) => {
    try {
      // Backend exposes auth under /api/auth/login and returns { accessToken, refreshToken, user }
      const res = await api.post('/auth/login', credentials);
      const { accessToken: tkn, refreshToken: rTkn, user: usr } = res.data;
      // persist
      await AsyncStorage.setItem('token', tkn);
      await AsyncStorage.setItem('refreshToken', rTkn);
      await AsyncStorage.setItem('user', JSON.stringify(usr));
      api.defaults.headers.common.Authorization = `Bearer ${tkn}`;
      setTokenState(tkn);
      setRefreshTokenState(rTkn);
      setUser(usr);

      // Connect socket with new token
      try {
        await socketService.updateToken(tkn);
        await socketService.connect();
      } catch (socketError) {
        console.warn('Socket connection failed during sign in:', socketError);
      }

      return usr;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    console.log('[AuthContext] Updating user:', userData);
    console.log('[AuthContext] isProfileComplete:', userData?.isProfileComplete);
    console.log('[AuthContext] profileIncomplete in userData:', userData?.profileIncomplete);

    setUser(prev => {
      // Use profileIncomplete from backend if provided, otherwise compute it
      const profileIncomplete = userData.profileIncomplete !== undefined ? userData.profileIncomplete : checkProfileIncomplete({ ...prev, ...userData });
      const updatedUserData = {
        ...prev,
        ...userData,
        profileIncomplete
      };
      AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
      console.log('[AuthContext] User updated in context and storage, profileIncomplete:', profileIncomplete);
      return updatedUserData;
    });
  };

  // Helper function to check if profile is incomplete
  const checkProfileIncomplete = (userData) => {
    if (!userData) return true;

    // If backend explicitly says profile is complete, trust it
    if (userData.isProfileComplete === true) {
      console.log('[AuthContext] Profile marked as complete by backend');
      return false;
    }

    // Check required fields for complete profile
    const requiredFields = [
      'name',
      'email',
      'specialization',
      'experience',
      'highestQualification',
      'city',
      'state'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = userData[field];
      return !value || value === '' || value === 'Not specified';
    });

    console.log('[AuthContext] Profile check - missing fields:', missingFields);
    return missingFields.length > 0;
  };

  const signUp = async (userData) => {
    const res = await api.post('/register', userData);
    return res.data;
  };

  const setToken = async (newToken) => {
    if (newToken) {
      await AsyncStorage.setItem('token', newToken);
    } else {
      await AsyncStorage.removeItem('token');
    }
    setTokenState(newToken);
    if (newToken) {
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      // Update socket token if connected
      socketService.updateToken(newToken);
    } else {
      delete api.defaults.headers.common.Authorization;
      socketService.disconnect();
    }
  };

  const setRefreshToken = (newRefreshToken) => {
    setRefreshTokenState(newRefreshToken);
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setTokenState(null);
    setRefreshTokenState(null);
    delete api.defaults.headers.common.Authorization;

    // Disconnect socket on sign out
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, loading, signIn, signUp, signOut, updateUser, setToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
