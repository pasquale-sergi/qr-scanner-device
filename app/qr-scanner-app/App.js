import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ExpiringProductsScreen from './src/screens/ExpiringProductsScreen';
import BottomTabs from './src/navigation/BottomTabs';
// Simple placeholder screen for Signup
import { View, Text, StyleSheet, Button } from 'react-native';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Auth screens */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }} 
          />

          {/* Main app with bottom tabs */}
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabs} 
            options={{ headerShown: false }} 
          />

          {/* Screens outside tabs */}
          <Stack.Screen 
            name="ExpiringProducts" 
            component={ExpiringProductsScreen} 
            options={{ title: 'Expiring Products' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
