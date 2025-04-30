import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WalletComponent = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>المحفظة</Text>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>إجمالي الرصيد</Text>
        <Text style={styles.balanceAmount}>0 رس</Text>
      </View>

      {/* Coming Soon Overlay */}
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>قريباً!</Text>
      </View>

      {/* Add Balance Button (Disabled) */}
      <TouchableOpacity
        style={[styles.button, styles.disabledButton]}
        disabled={true}
      >
        <Text style={styles.buttonText}>إضافة رصيد</Text>
        <Text style={styles.buttonAmount}>1 رس</Text>
      </TouchableOpacity>

      {/* Pay Button (Disabled) */}
      <TouchableOpacity
        style={[styles.button, styles.disabledButton]}
        disabled={true}
      >
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 30,
    color: "#333",
  },
  balanceContainer: {
    marginBottom: 30,
    alignItems: "flex-end",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A3981",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0A3981",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonAmount: {
    color: "#fff",
    fontSize: 16,
  },
  comingSoonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  comingSoonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A3981",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 10,
  },
});

export default WalletComponent;
