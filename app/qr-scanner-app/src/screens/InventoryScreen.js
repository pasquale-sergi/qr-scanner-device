// src/screens/InventoryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

// Sample data for products
const products = [
  { id: '1', name: 'Milk', category: 'Dairy', status: 'Open', dueIn: '2d' },
  { id: '2', name: 'Eggs', category: 'Dairy', status: 'Open', dueIn: '5d' },
  { id: '3', name: 'Apples', category: 'Fruits', status: 'Open', dueIn: '1d' },
  { id: '4', name: 'Carrots', category: 'Vegetables', status: 'Open', dueIn: '7d' },
  { id: '5', name: 'Chicken Breast', category: 'Meat', status: 'Open', dueIn: '3d' },
];

// Categories for tabs
const categories = ['All', 'Dairy', 'Fruits', 'Vegetables', 'Meat'];

const InventoryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample stats
  const totalItems = products.length;
  const almostExpiredCount = products.filter((p) => p.dueIn === '1d' || p.dueIn === '2d').length;

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
      <Text style={styles.dueIn}>{item.dueIn} left</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Top bar with stats */}
      <View style={styles.topBarContainer}>
        <View style={styles.topBar}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('ExpiringProducts')}
          >
            <Text style={[styles.statNumber, styles.clickable]}>{almostExpiredCount}</Text>
            <Text style={[styles.statLabel, styles.clickable]}>Almost Expired</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.tab,
              selectedCategory === cat && styles.activeTab,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBarContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#7B61FF', // Purple gradient base color
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#7B61FF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 4,
  },
  clickable: {
    textDecorationLine: 'underline',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    marginRight: 20,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#7B61FF',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  productCard: {
    backgroundColor: '#fafafa',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#7B61FF',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 13,
    color: '#666',
  },
  dueIn: {
    fontSize: 12,
    color: '#999',
  },
});

export default InventoryScreen;
