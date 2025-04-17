
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ScanScreen from '../screens/ScanScreen'; // Create a placeholder if you don't have it yet

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          left: 15,
          right: 15,
          elevation: 5,
          backgroundColor: '#fff',
          borderRadius: 30,
          height: 60,
          shadowColor: '#7B61FF',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="home-outline" size={24} color={focused ? '#7B61FF' : '#999'} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="list-outline" size={24} color={focused ? '#7B61FF' : '#999'} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="scan-outline" size={30} color={focused ? '#7B61FF' : '#999'} />
          ),
        
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="person-outline" size={24} color={focused ? '#7B61FF' : '#999'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
