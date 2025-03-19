import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Index() {
  const username = "Pasquale"; // Replace with dynamic username if available
  const router = useRouter();
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <Text style={styles.subtitle}>
          Manage your inventory with ease. What would you like to do today?
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonGrid}>
          {/* Top Row - 2 boxes */}
          <View style={styles.row}>
            {/* View Inventory */}
            <Link href="/inventory" asChild>
              <TouchableOpacity style={styles.box}>
                <Ionicons name="list" size={40} color="#FFFFFF" />
                <Text style={styles.boxText}>View Inventory</Text>
              </TouchableOpacity>
            </Link>

            {/* Scan Product */}
            <TouchableOpacity style={styles.box} onPress={() => router.push("/scan")}>
              <MaterialIcons name="qr-code-scanner" size={40} color="#FFFFFF" />
              <Text style={styles.boxText}>Scan Product</Text>
            </TouchableOpacity>
          </View>

          {/* Middle Row - 1 wide box */}
          <View style={styles.row}>
            {/* Manage Categories */}
            <TouchableOpacity style={styles.wideBox}>
              <Ionicons name="grid" size={40} color="#FFFFFF" />
              <Text style={styles.boxText}>Manage Categories</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Row - 2 boxes */}
          <View style={styles.row}>
            {/* Connected Devices */}
            <TouchableOpacity style={styles.box}>
              <Ionicons name="hardware-chip" size={40} color="#FFFFFF" />
              <Text style={styles.boxText}>Connected Devices</Text>
            </TouchableOpacity>

            {/* Low Stock Alerts */}
            <Link href="/stock_alert" asChild>
            <TouchableOpacity style={styles.box}>
              <Ionicons name="alert-circle" size={40} color="#FFFFFF" />
              <Text style={styles.boxText}>Low Stock Alerts</Text>
            </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    marginTop: 60,
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonGrid: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  box: {
    width: "48%", // Slightly less than half to allow for spacing
    aspectRatio: 1, // Makes the box square
    backgroundColor: "#5e35b1", // Purple color from the image
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  wideBox: {
    width: "100%", // Full width
    aspectRatio: 2.5, // Wider and shorter
    backgroundColor: "#5e35b1", // Purple color from the image
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  boxText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
