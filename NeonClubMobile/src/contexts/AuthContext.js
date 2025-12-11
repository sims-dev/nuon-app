import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, probeAndFixBase } from '../services/api';
import socketService from '../services/socket';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
  setToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always start fresh - clear any cached auth data for proper onboarding flow
    const clearAuth = async () => {
      try {
        await AsyncStorage.clear();
        setUser(null);
        setTokenState(null);
        // No need to delete api headers, handled by fetch
        console.log('[AuthContext] Cleared cached auth data for fresh onboarding flow');
      } catch (error) {
        console.error('[AuthContext] Error clearing auth data:', error);
      } finally {
        setLoading(false);
      }
    };

    clearAuth();
  }, []);

  const signIn = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      const { token: tkn, user: usr } = res.data;
      // persist
      await AsyncStorage.setItem('token', tkn);
      await AsyncStorage.setItem('user', JSON.stringify(usr));
      setTokenState(tkn);
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
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    console.log('[AuthContext] User updated in context and storage');
  };

  const signUp = async (userData) => {
    const res = await authAPI.register(userData);
    return res.data;
  };

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      // Update socket token if connected
      socketService.updateToken(newToken);
    } else {
      socketService.disconnect();
    }
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setTokenState(null);
    // Disconnect socket on sign out
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, updateUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
