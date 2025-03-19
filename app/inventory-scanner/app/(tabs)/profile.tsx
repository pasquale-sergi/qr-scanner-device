import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

// Define interface for SettingItem props
interface SettingItemProps {
  icon: string; // Ionicons name
  title: string;
  description?: string; // Optional
  hasToggle: boolean;
  value?: boolean; // Optional, needed only when hasToggle is true
  onValueChange?: () => void; // Optional, needed only when hasToggle is true
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    description,
    hasToggle,
    value,
    onValueChange,
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={22} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={value ? "#007AFF" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#C8C8C8" />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="moon"
              title="Dark Mode"
              description="Switch to dark theme"
              hasToggle={true}
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
            <SettingItem
              icon="notifications"
              title="Notifications"
              description="Enable push notifications"
              hasToggle={true}
              value={notifications}
              onValueChange={() => setNotifications(!notifications)}
            />
            <SettingItem
              icon="location"
              title="Location Services"
              description="Allow app to use your location"
              hasToggle={true}
              value={locationServices}
              onValueChange={() => setLocationServices(!locationServices)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person"
              title="Personal Information"
              description="Manage your personal details"
              hasToggle={false}
            />
            <SettingItem
              icon="lock-closed"
              title="Security"
              description="Change password and security settings"
              hasToggle={false}
            />
            <SettingItem
              icon="card"
              title="Payment Methods"
              description="Manage your payment options"
              hasToggle={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle"
              title="Help Center"
              description="Get help with using the app"
              hasToggle={false}
            />
            <SettingItem
              icon="document-text"
              title="Terms of Service"
              hasToggle={false}
            />
            <SettingItem
              icon="shield"
              title="Privacy Policy"
              hasToggle={false}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 15,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#007AFF",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    marginLeft: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
