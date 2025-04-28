import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ChevronDown, ChevronUp, Check } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { ExtraService, Service } from "@/interfaces/interfaces";

interface ServiceAccordionProps {
  service: Service;
  onAddToCart: (serviceId: number, extraServices: number[]) => Promise<void>;
}

export default function ServiceAccordion({
  service,
  onAddToCart,
}: ServiceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExtra = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id)
        ? prev.filter((extraId) => extraId !== id)
        : [...prev, id]
    );
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(service.serviceId, selectedExtras);
      // Reset selections after successful add
      setSelectedExtras([]);
      setIsExpanded(false);
      Toast.show({
        type: "success",
        text1: "تمت الإضافة إلى السلة بنجاح",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء إضافة الخدمة إلى السلة",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = service.servicesPrice;
    if (selectedExtras.length > 0 && service.extraServices) {
      service.extraServices.forEach((extra: ExtraService) => {
        if (selectedExtras.includes(extra.id)) {
          total += extra.extraPrice;
        }
      });
    }
    return total;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{service.servicesNameAr}</Text>
            <Text style={styles.price}>{service.servicesPrice} ر.س</Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#0A3981" />
          ) : (
            <ChevronDown size={20} color="#0A3981" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.description}>
            {service.servicesDescriptionsAr}
          </Text>

          {service.extraServices && service.extraServices.length > 0 && (
            <View style={styles.extrasContainer}>
              <Text style={styles.extrasTitle}>الخدمات الإضافية</Text>

              {service.extraServices.map((extra: ExtraService) => (
                <TouchableOpacity
                  key={extra.id}
                  style={styles.extraItem}
                  onPress={() => toggleExtra(extra.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.extraCheckbox}>
                    {selectedExtras.includes(extra.id) && (
                      <Check size={16} color="#0A3981" />
                    )}
                  </View>
                  <View style={styles.extraInfo}>
                    <Text style={styles.extraName}>{extra.extraNameAr}</Text>
                    <Text style={styles.extraPrice}>
                      {extra.extraPrice} ر.س
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>المجموع:</Text>
              <Text style={styles.totalPrice}>{calculateTotalPrice()} ر.س</Text>
            </View>

            <TouchableOpacity
              style={[styles.addToCartButton, loading && styles.disabledButton]}
              onPress={handleAddToCart}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  price: {
    fontSize: 14,
    color: "#0A3981",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "right",
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "right",
    lineHeight: 20,
  },
  extrasContainer: {
    marginBottom: 16,
  },
  extrasTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "right",
  },
  extraItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  extraCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#0A3981",
    borderRadius: 4,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  extraInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  extraName: {
    fontSize: 14,
    color: "#333",
    textAlign: "right",
  },
  extraPrice: {
    fontSize: 14,
    color: "#0A3981",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
  },
  addToCartButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    borderRadius: 8,
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
