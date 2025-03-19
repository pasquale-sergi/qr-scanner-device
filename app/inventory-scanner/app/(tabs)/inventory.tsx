import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

// Sample inventory data
const initialItems: InventoryItem[] = [
  { id: "1", name: "Apple", quantity: 5, category: "Food" },
  { id: "2", name: "Banana", quantity: 3, category: "Food" },
  { id: "3", name: "Dish Soap", quantity: 2, category: "Cleaning" },
  { id: "4", name: "Laundry Detergent", quantity: 1, category: "Cleaning" },
  { id: "5", name: "Notebook", quantity: 0, category: "Stationery" },
  { id: "6", name: "Pen", quantity: 10, category: "Stationery" },
];

export default function InventoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(
    initialItems.filter((item) => item.quantity > 0) // Filter items with quantity >= 1
  );

  // Get unique categories from the inventory
  const categories = Array.from(
    new Set(initialItems.map((item) => item.category))
  );

  // Filter items based on the selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Inventory</Text>

      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)} // Show all items
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === null && styles.categoryButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in this category.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333333",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemCategory: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  quantityContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666666",
    marginTop: 20,
  },
});
