import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Device {
  id: string;
  name: string;
  location: string;
  status: "Online" | "Offline";
  lastActivity: string; // Last time the device was used
}

// Sample data for connected devices
const initialDevices: Device[] = [
  { id: "1", name: "Kitchen Scanner", location: "Kitchen", status: "Online", lastActivity: "5 minutes ago" },
  { id: "2", name: "Pantry Scanner", location: "Pantry", status: "Offline", lastActivity: "2 days ago" },
  { id: "3", name: "Garage Scanner", location: "Garage", status: "Online", lastActivity: "1 hour ago" },
];

export default function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  // Function to handle renaming a device
  const handleRename = (deviceId: string) => {
    Alert.prompt(
      "Rename Device",
      "Enter a new name for the device:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (newName) => {
            if (newName) {
              setDevices((prevDevices) =>
                prevDevices.map((device) =>
                  device.id === deviceId ? { ...device, name: newName } : device
                )
              );
              Alert.alert("Device Renamed", "The device has been renamed successfully.");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  // Function to handle removing a device
  const handleRemove = (deviceId: string) => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setDevices((prevDevices) =>
              prevDevices.filter((device) => device.id !== deviceId)
            );
            Alert.alert("Device Removed", "The device has been removed.");
          },
        },
      ]
    );
  };

  // Function to handle adding a new device
  const handleAddDevice = () => {
    Alert.alert(
      "Add New Device",
      "This feature will allow you to add a new device by scanning its QR code or entering its ID. (Coming soon!)"
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceContainer}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceLocation}>Location: {item.location}</Text>
        <Text style={styles.deviceStatus}>
          Status:{" "}
          <Text
            style={{
              color: item.status === "Online" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {item.status}
          </Text>
        </Text>
        <Text style={styles.deviceLastActivity}>
          Last Activity: {item.lastActivity}
        </Text>
      </View>
      <View style={styles.deviceActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRename(item.id)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemove(item.id)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Connected Devices</Text>

      {/* Add New Device Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Device</Text>
      </TouchableOpacity>

      {/* List of Devices */}
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No devices connected.</Text>
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  deviceContainer: {
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
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deviceLocation: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  deviceStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  deviceLastActivity: {
    fontSize: 12,
    color: "#999999",
    marginTop: 5,
  },
  deviceActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666666",
    marginTop: 20,
  },
});
