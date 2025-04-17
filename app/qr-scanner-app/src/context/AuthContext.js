// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login as apiLogin, signup as apiSignup, logout} from '../services/authService'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // Start with loading
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is logged in when app starts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const token = await AsyncStorage.getItem('userToken');
        
        if (userInfoString && token) {
          setUserInfo(JSON.parse(userInfoString));
          setUserToken(token);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(username, password);
      
      const userInfo = response.user || response.userInfo || response;
      const token = response.token || response.accessToken || response.jwt;
      console.log("Received user info: ", userInfo);
      if (!userInfo || !token) {
        throw new Error('Invalid response format from server');
      }
      
      setUserInfo(userInfo);
      setUserToken(token);
 
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      await AsyncStorage.setItem('userToken', token);
      
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (username, email, password) => {
    try {
      setIsLoading(true);
      const response = await apiSignup(email, username, password);
      console.log("Retrieved response: ", response);


      return {success: true}
      
  
    } catch (error) {
      console.log('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      // Clear state
      setUserToken(null);
      setUserInfo(null);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      
      return true;
    } catch (error) {
      console.log('Logout error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
