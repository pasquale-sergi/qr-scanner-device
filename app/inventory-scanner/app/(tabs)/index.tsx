import { Link } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
  const username = "John"; // Replace with dynamic username if available

  return (
    <View style={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>
        Manage your inventory with ease. What would you like to do today?
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Scan Product Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Scan Product</Text>
        </TouchableOpacity>

        {/* Manage Categories Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Categories</Text>
        </TouchableOpacity>

        {/* View Inventory Button */}
        <Link href="/inventory" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Inventory</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Keep track of your items and stay organized!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginTop: 30,
  },
});
