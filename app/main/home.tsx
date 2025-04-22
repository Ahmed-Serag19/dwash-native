import { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useUser } from "@/context/UserContext";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      const isIncomplete =
        !user.email?.trim() || !user.nameAr?.trim() || !user.nameEn?.trim();
      setShowIncompleteModal(isIncomplete);
    }
  }, [user]);

  const goToProfile = () => {
    setShowIncompleteModal(false);
    router.push("/main/profile");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>الرئيسية</Text>

      <Modal
        visible={showIncompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>فضلاً حدث الملف الشخصي</Text>
            <TouchableOpacity style={styles.button} onPress={goToProfile}>
              <Text style={styles.buttonText}>الملف الشخصي</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  button: {
    backgroundColor: "#0A3981", // primary
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
