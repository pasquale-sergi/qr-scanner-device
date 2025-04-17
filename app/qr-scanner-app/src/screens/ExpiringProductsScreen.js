// src/screens/ExpiringProductsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

// Sample expiring products (dueIn <= 2 days)
const expiringProducts = [
  { id: '1', name: 'Milk', category: 'Dairy', dueIn: '2d' },
  { id: '3', name: 'Apples', category: 'Fruits', dueIn: '1d' },
  { id: '5', name: 'Chicken Breast', category: 'Meat', dueIn: '3d' },
];

const ExpiringProductsScreen = () => {
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
      <Text style={styles.dueIn}>{item.dueIn} left</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expiringProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: { padding: 20 },
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
  productName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  productCategory: { fontSize: 13, color: '#666' },
  dueIn: { fontSize: 12, color: '#999' },
});

export default ExpiringProductsScreen;
