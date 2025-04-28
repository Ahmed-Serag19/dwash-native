import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Check } from "lucide-react-native";
import type { Service } from "@/interfaces/interfaces";

interface ExtraServicesModalProps {
  isVisible: boolean;
  onClose: () => void;
  service: Service | null;
  selectedExtras: number[];
  onToggleExtra: (id: number) => void;
  onAddToCart: () => void;
  loading: boolean;
}

export default function ExtraServicesModal({
  isVisible,
  onClose,
  service,
  selectedExtras,
  onToggleExtra,
  onAddToCart,
  loading,
}: ExtraServicesModalProps) {
  if (!service) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر الخدمات الإضافية</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              disabled={loading}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {service.extraServices && service.extraServices.length > 0 ? (
              service.extraServices.map((extra) => (
                <TouchableOpacity
                  key={extra.id}
                  style={styles.extraItem}
                  onPress={() => onToggleExtra(extra.id)}
                  disabled={loading}
                >
                  <View style={styles.extraCheckbox}>
                    {selectedExtras.includes(extra.id) && (
                      <Check size={16} color="#0A3981" />
                    )}
                  </View>
                  <View style={styles.extraInfo}>
                    <Text style={styles.extraName}>{extra.extraNameAr}</Text>
                    <Text style={styles.extraDescription}>
                      {extra.extraDescriptionsAr}
                    </Text>
                    <Text style={styles.extraPrice}>
                      {extra.extraPrice} ر.س
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noExtrasText}>
                لا توجد خدمات إضافية متاحة
              </Text>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addToCartButton, loading && styles.disabledButton]}
              onPress={onAddToCart}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addToCartButtonText}>إضافة إلى السلة</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  extraItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  extraCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#0A3981",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  extraInfo: {
    flex: 1,
  },
  extraName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "right",
  },
  extraDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "right",
  },
  extraPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A3981",
    textAlign: "right",
  },
  noExtrasText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
