import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  console.log('Auth context in HomeScreen:', authContext);
  const { userInfo = {}, logout = () => {}, userToken } = authContext || {};

  useEffect(() => {
    if (!authContext || !userToken) {
      console.log('No auth context or token, redirecting to Login');
      navigation.replace('Login');
    }
  }, [authContext, userToken, navigation]);

  if (!authContext) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const goToInventory = () => {
    navigation.navigate('Inventory'); // Navigate to Inventory screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Home</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>
            Welcome, {userInfo?.name || userInfo?.username || 'User'}!
          </Text>
          <Text style={styles.infoText}>You are now logged in to the app.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={goToInventory}>
          <Text style={styles.primaryButtonText}>Go to Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#7B61FF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#7B61FF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    marginBottom: 40,
    shadowColor: '#7B61FF',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: '#7B61FF',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7B61FF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7B61FF',
  },
});


export default HomeScreen;
