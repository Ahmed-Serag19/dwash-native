import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ConfirmLogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLogoutModal({
  visible,
  onConfirm,
  onCancel,
}: ConfirmLogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>هل أنت متأكد أنك تريد تسجيل الخروج؟</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onConfirm}
            >
              <Text style={styles.primaryText}>نعم</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onCancel}
            >
              <Text style={styles.secondaryText}>لا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0A3981",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#333",
    fontWeight: "600",
  },
});
