import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export function BookingHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.push("/main/cart")}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#0A3981" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
