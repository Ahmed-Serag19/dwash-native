import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

interface IncompleteProfileModalProps {
  visible: boolean;
  onPress: () => void;
}

export default function IncompleteProfileModal({
  visible,
  onPress,
}: IncompleteProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>فضلاً حدث الملف الشخصي</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onPress}>
            <Text style={styles.modalButtonText}>الملف الشخصي</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
