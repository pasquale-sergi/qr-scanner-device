import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define product type
interface Product {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
  alertEnabled: boolean;
}

// Mock data - replace with your actual data source
const initialProducts: Product[] = [
  { id: "1", name: "Printer Paper", currentStock: 5, threshold: 10, alertEnabled: true },
  { id: "2", name: "Ink Cartridges", currentStock: 2, threshold: 3, alertEnabled: true },
  { id: "3", name: "Staplers", currentStock: 12, threshold: 5, alertEnabled: false },
  { id: "4", name: "Notebooks", currentStock: 8, threshold: 15, alertEnabled: true },
  { id: "5", name: "Pens (Black)", currentStock: 20, threshold: 25, alertEnabled: true },
  { id: "6", name: "Highlighters", currentStock: 4, threshold: 10, alertEnabled: true },
  { id: "7", name: "Sticky Notes", currentStock: 7, threshold: 5, alertEnabled: false },
  { id: "8", name: "Binders", currentStock: 3, threshold: 8, alertEnabled: true },
];

// Mock inventory products without thresholds
const inventoryProducts: Product[] = [
  { id: "9", name: "Desk Lamps", currentStock: 6, threshold: 0, alertEnabled: false },
  { id: "10", name: "Desk Organizers", currentStock: 9, threshold: 0, alertEnabled: false },
  { id: "11", name: "Scissors", currentStock: 15, threshold: 0, alertEnabled: false },
  { id: "12", name: "Folders", currentStock: 25, threshold: 0, alertEnabled: false },
];

export default function StockAlertPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [threshold, setThreshold] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>(inventoryProducts);

  // Get products that are below threshold
  const lowStockProducts = products.filter(
    (product) => product.alertEnabled && product.currentStock < product.threshold
  );

  // Products to display based on filter
  const displayProducts = filterLowStock ? lowStockProducts : products;

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setThreshold(product.threshold.toString());
    setAlertEnabled(product.alertEnabled);
    setModalVisible(true);
  };

  const saveThreshold = () => {
    if (!threshold || isNaN(parseInt(threshold)) || parseInt(threshold) < 0) {
      Alert.alert("Invalid Input", "Please enter a valid number for the threshold.");
      return;
    }

    if (selectedProduct) {
      const updatedProducts = products.map((product) => {
        if (product.id === selectedProduct.id) {
          return {
            ...product,
            threshold: parseInt(threshold),
            alertEnabled: alertEnabled,
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      setModalVisible(false);
    }
  };

  const openAddModal = () => {
    setSearchQuery("");
    setAddModalVisible(true);
  };

  const addProductAlert = (product: Product) => {
    // Check if product already has an alert
    if (products.some(p => p.id === product.id)) {
      Alert.alert(
        "Product Already Has Alert",
        "This product already has a stock alert set up. You can edit it from the main list.",
        [{ text: "OK" }]
      );
      return;
    }

    // Add the product to the alerts list with default threshold
    setSelectedProduct({
      ...product,
      threshold: Math.max(5, Math.floor(product.currentStock / 2)), // Default to half current stock or 5, whichever is higher
      alertEnabled: true
    });
    setThreshold(Math.max(5, Math.floor(product.currentStock / 2)).toString());
    setAlertEnabled(true);
    setAddModalVisible(false);
    setModalVisible(true);
  };

  const confirmAddProduct = () => {
    if (selectedProduct && parseInt(threshold) > 0) {
      const newProduct = {
        ...selectedProduct,
        threshold: parseInt(threshold),
        alertEnabled: alertEnabled
      };
      
      setProducts([...products, newProduct]);
      
      // Remove from available products
      setAvailableProducts(availableProducts.filter(p => p.id !== selectedProduct.id));
      
      setModalVisible(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isLowStock = item.currentStock < item.threshold && item.alertEnabled;

    const removeProduct = (productId: string) => {
        Alert.alert(
          "Remove Product",
          `Are you sure you want to remove the alert for "${item.name}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Remove",
              style: "destructive",
              onPress: () => {
                setProducts(products.filter((product) => product.id !== productId));
              },
            },
          ]
        );
      };
    
      return (
        <TouchableOpacity
          style={[styles.productItem, isLowStock && styles.lowStockItem]}
          onPress={() => openEditModal(item)}
        >
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.stockInfo}>
              Current Stock:{" "}
              <Text style={isLowStock ? styles.lowStockText : undefined}>
                {item.currentStock}
              </Text>
            </Text>
            <Text style={styles.thresholdInfo}>Alert Threshold: {item.threshold}</Text>
          </View>
    
          <View style={styles.statusContainer}>
            {isLowStock && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertText}>LOW</Text>
              </View>
            )}
            <Text style={styles.statusText}>
              {item.alertEnabled ? "Alert On" : "Alert Off"}
            </Text>
            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <Ionicons name="trash" size={24} color="#ff3b30" style={styles.trashIcon} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };

  const renderAvailableProductItem = ({ item }: { item: Product }) => {
    const filteredItem = searchQuery.length > 0 && 
      !item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filteredItem) return null;
    
    return (
      <TouchableOpacity 
        style={styles.availableProductItem} 
        onPress={() => addProductAlert(item)}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.stockInfo}>
            Current Stock: {item.currentStock}
          </Text>
        </View>
        
        <View style={styles.addButtonContainer}>
          <MaterialIcons name="add-circle" size={28} color="#5e35b1" />
        </View>
      </TouchableOpacity>
    );
  };

  
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Stock Alerts</Text>
          </View>
  
          {/* Filter and Add Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filterLowStock && styles.filterActive]}
              onPress={() => setFilterLowStock(!filterLowStock)}
            >
              <Ionicons
                name={filterLowStock ? "filter" : "filter-outline"}
                size={20}
                color={filterLowStock ? "#fff" : "#5e35b1"}
              />
              <Text style={[styles.filterText, filterLowStock && styles.filterActiveText]}>
                {filterLowStock ? "Showing Low Stock Only" : "Show Low Stock Only"}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Alert</Text>
            </TouchableOpacity>
          </View>
  
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>{lowStockProducts.length}</Text>
              <Text style={styles.summaryLabel}>Products Below Threshold</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>
                {products.filter((p) => p.alertEnabled).length}
              </Text>
              <Text style={styles.summaryLabel}>Active Alerts</Text>
            </View>
          </View>
  
          {/* Product List */}
          <Text style={styles.sectionTitle}>
            {filterLowStock ? "Low Stock Items" : "All Products"}
          </Text>
  
          {displayProducts.length > 0 ? (
            <FlatList
              data={displayProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#5e35b1" />
              <Text style={styles.emptyText}>
                {filterLowStock
                  ? "No products below threshold! Your inventory is in good shape."
                  : "No products found. Add products to set stock alerts."}
              </Text>
              {!filterLowStock && (
                <TouchableOpacity style={styles.emptyAddButton} onPress={openAddModal}>
                  <Text style={styles.emptyAddButtonText}>Add Product Alert</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
  
          {/* Edit Threshold Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Set Stock Alert</Text>
  
                  {selectedProduct && (
                    <Text style={styles.productNameModal}>{selectedProduct.name}</Text>
                  )}
  
                  <Text style={styles.inputLabel}>Current Stock:</Text>
                  {selectedProduct && (
                    <Text style={styles.currentStockValue}>
                      {selectedProduct.currentStock} units
                    </Text>
                  )}
  
                  <Text style={styles.inputLabel}>Alert Threshold:</Text>
                  <TextInput
                    style={styles.input}
                    value={threshold}
                    onChangeText={setThreshold}
                    keyboardType="numeric"
                    placeholder="Enter minimum stock level"
                  />
  
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Enable Alert:</Text>
                    <Switch
                      value={alertEnabled}
                      onValueChange={setAlertEnabled}
                      trackColor={{ false: "#ccc", true: "#5e35b1" }}
                      thumbColor={alertEnabled ? "#fff" : "#f4f3f4"}
                    />
                  </View>
  
                  <Text style={styles.alertExplanation}>
                    You'll be alerted when stock falls below the threshold.
                  </Text>
  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={
                        products.some((p) => p.id === selectedProduct?.id)
                          ? saveThreshold
                          : confirmAddProduct
                      }
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
  
          {/* Add Product Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={addModalVisible}
            onRequestClose={() => setAddModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add Stock Alert</Text>
  
                  <Text style={styles.inputLabel}>Search Products:</Text>
                  <TextInput
                    style={styles.input}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by product name"
                    autoFocus
                  />
  
                  <Text style={styles.availableProductsTitle}>Available Products:</Text>
  
                  {availableProducts.length > 0 ? (
                    <FlatList
                      data={availableProducts}
                      renderItem={renderAvailableProductItem}
                      keyExtractor={(item) => item.id}
                      style={styles.availableProductsList}
                      contentContainerStyle={{ paddingBottom: 10 }}
                    />
                  ) : (
                    <Text style={styles.noProductsText}>
                      No products available to add alerts for.
                    </Text>
                  )}
  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { marginTop: 15 }]}
                    onPress={() => setAddModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({

  trashIcon: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#5e35b1",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0e6ff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: "#5e35b1",
  },
  filterText: {
    color: "#5e35b1",
    marginLeft: 5,
    fontWeight: "500",
  },
  filterActiveText: {
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5e35b1",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "500",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5e35b1",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lowStockItem: {
    borderLeftWidth: 5,
    borderLeftColor: "#ff3b30",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  stockInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  lowStockText: {
    color: "#ff3b30",
    fontWeight: "bold",
  },
  thresholdInfo: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  alertBadge: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 5,
  },
  alertText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  chevron: {
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  emptyAddButton: {
    backgroundColor: "#5e35b1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  emptyAddButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5e35b1",
    marginBottom: 15,
    textAlign: "center",
  },
  productNameModal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  currentStockValue: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  alertExplanation: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#5e35b1",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  availableProductsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  availableProductsList: {
    maxHeight: 300,
  },
  availableProductItem: {
    backgroundColor: "#f9f5ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonContainer: {
    marginLeft: 10,
  },
  noProductsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginVertical: 20,
  },
});
