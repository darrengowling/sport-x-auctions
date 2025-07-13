import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Verify token with backend
        const response = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, loginType = 'email') => {
    try {
      let endpoint = '';
      let payload = credentials;

      switch (loginType) {
        case 'email':
          endpoint = '/auth/login';
          break;
        case 'phone':
          endpoint = '/auth/login/phone';
          break;
        case 'google':
          endpoint = '/auth/google';
          break;
        case 'facebook':
          endpoint = '/auth/facebook';
          break;
        case 'apple':
          endpoint = '/auth/apple';
          break;
        case 'guest':
          endpoint = '/auth/guest';
          payload = { deviceId: generateDeviceId() };
          break;
        default:
          throw new Error('Invalid login type');
      }

      const response = await axios.post(`${API}${endpoint}`, payload);
      const { token, user: userData } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData, registerType = 'email') => {
    try {
      let endpoint = '';
      let payload = userData;

      switch (registerType) {
        case 'email':
          endpoint = '/auth/register';
          break;
        case 'phone':
          endpoint = '/auth/register/phone';
          break;
        default:
          throw new Error('Invalid registration type');
      }

      const response = await axios.post(`${API}${endpoint}`, payload);
      const { token, user: newUser } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const generateDeviceId = () => {
    return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const sendPhoneVerification = async (phoneNumber) => {
    try {
      const response = await axios.post(`${API}/auth/phone/send-code`, {
        phoneNumber
      });
      return { success: true, message: 'Verification code sent' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send verification code' 
      };
    }
  };

  const verifyPhoneCode = async (phoneNumber, code) => {
    try {
      const response = await axios.post(`${API}/auth/phone/verify-code`, {
        phoneNumber,
        code
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid verification code' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    sendPhoneVerification,
    verifyPhoneCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};