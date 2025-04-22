import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { User, ShoppingCart, LogOut } from "lucide-react-native";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

interface MoreMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateProfile: () => void;
  onNavigateCart: () => void;
  onLogout: () => void;
}

export default function MoreMenuModal({
  visible,
  onClose,
  onNavigateProfile,
  onNavigateCart,
  onLogout,
}: MoreMenuModalProps) {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleLogoutPress = () => {
    setConfirmVisible(true);
  };

  return (
    <>
      {/* Main More Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onNavigateProfile}
            >
              <User size={20} color="#0A3981" />
              <Text style={styles.menuText}>الملف الشخصي</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onNavigateCart}>
              <ShoppingCart size={20} color="#0A3981" />
              <Text style={styles.menuText}>سلة التسوق</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogoutPress}
            >
              <LogOut size={20} color="#0A3981" />
              <Text style={styles.menuText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation Modal */}
      <ConfirmLogoutModal
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          onClose();
          onLogout();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "85%",
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    marginRight: 16,
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
});
