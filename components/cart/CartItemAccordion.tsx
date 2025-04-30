import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react-native";
import { router } from "expo-router";

interface CartItemAccordionProps {
  item: any;
  onDelete: (invoiceId: number, itemId: number) => void;
}

export default function CartItemAccordion({
  item,
  onDelete,
}: CartItemAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateTotalPrice = () => {
    const basePrice = item.itemDto?.itemPrice || 0;
    const extrasTotal =
      item.itemDto?.itemExtraDtos?.reduce(
        (sum: number, extra: { itemExtraPrice: number }) =>
          sum + (extra.itemExtraPrice || 0),
        0
      ) || 0;
    return basePrice + extrasTotal;
  };

  const totalPrice = calculateTotalPrice();

  const handleBookNow = () => {
    router.push({
      pathname: "/booking-details",
      params: { invoiceId: item.invoiceId, brandId: item.brandId },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{item.itemDto?.itemNameAr || "خدمة"}</Text>
          {isExpanded ? (
            <ChevronUp size={20} color="#0A3981" />
          ) : (
            <ChevronDown size={20} color="#0A3981" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.serviceType}>
            {item.itemDto?.serviceTypeAr || "غسيل سيارات"}
          </Text>
          <Text style={styles.price}>
            {item.itemDto?.itemPrice || 0} {"ر.س"}
          </Text>

          {/* Extra Services */}
          {item.itemDto?.itemExtraDtos &&
            item.itemDto.itemExtraDtos.length > 0 && (
              <View style={styles.extrasContainer}>
                <Text style={styles.extrasTitle}>الخدمات الإضافية</Text>
                {item.itemDto.itemExtraDtos.map((extra: any) => (
                  <View key={extra.itemExtraId} style={styles.extraItem}>
                    <Text style={styles.extraName}>
                      {extra.itemExtraNameAr}
                    </Text>
                    <Text style={styles.extraPrice}>
                      {extra.itemExtraPrice} {"ر.س"}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>المجموع:</Text>
            <Text style={styles.totalPrice}>
              {totalPrice.toFixed(2)} {"ر.س"}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(item.invoiceId, item.invoiceId)}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>حذف</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookNow}
              activeOpacity={0.7}
            >
              <Text style={styles.bookButtonText}>احجز الآن</Text>
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  serviceType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 12,
  },
  extrasContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  extrasTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  extraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  extraName: {
    fontSize: 14,
    color: "#333",
  },
  extraPrice: {
    fontSize: 14,
    color: "#0A3981",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
