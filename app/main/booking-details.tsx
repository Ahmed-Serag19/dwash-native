import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import CarSelector from "@/components/booking/CarSelector";
import AddressSelector from "@/components/booking/AddressSelector";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import DiscountInput from "@/components/booking/DiscountInput";

// Base URL for images
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";
// Default placeholder image for service providers
const defaultServiceProviderImage = require("@/assets/images/service-providers.jpg");

export default function BookingDetailsScreen() {
  const { invoiceId, brandId } = useLocalSearchParams();
  const invoiceIdNum =
    typeof invoiceId === "string" ? Number.parseInt(invoiceId) : 0;
  const brandIdNum = typeof brandId === "string" ? Number.parseInt(brandId) : 0;

  const [cartItem, setCartItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItem();
  }, [invoiceIdNum]);

  const fetchCartItem = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        router.push("/(auth)/Login");
        return;
      }

      const response = await axios.get(apiEndpoints.getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const items = response.data.content || [];
        const item = items.find((i: any) => i.invoiceId === invoiceIdNum);
        if (item) {
          setCartItem(item);
        } else {
          Toast.show({
            type: "error",
            text1: "لم يتم العثور على العنصر",
          });
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching cart item:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل تفاصيل الحجز",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = (code: string, amount: number, type: string) => {
    setDiscountCode(code);
    setDiscountAmount(amount);
    setDiscountType(type);
  };

  const calculateSubtotal = () => {
    if (!cartItem) return 0;
    const basePrice = cartItem.itemDto?.itemPrice || 0;
    const extrasTotal =
      cartItem.itemDto?.itemExtraDtos?.reduce(
        (sum: number, extra: { itemExtraPrice: number }) =>
          sum + (extra.itemExtraPrice || 0),
        0
      ) || 0;
    return basePrice + extrasTotal;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "PERCENTAGE") {
      return (subtotal * discountAmount) / 100;
    } else if (discountType === "AMOUNT") {
      return discountAmount;
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleConfirmBooking = async () => {
    if (!selectedCarId) {
      Toast.show({
        type: "error",
        text1: "الرجاء اختيار سيارة",
      });
      return;
    }

    if (!selectedAddressId) {
      Toast.show({
        type: "error",
        text1: "الرجاء اختيار عنوان",
      });
      return;
    }

    if (!selectedSlotId) {
      Toast.show({
        type: "error",
        text1: "الرجاء اختيار موعد",
      });
      return;
    }

    setProcessing(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        setProcessing(false);
        return;
      }

      const response = await axios.post(
        apiEndpoints.makePayment,
        {
          paymentMethodId: 2,
          invoiceId: invoiceIdNum,
          slotId: selectedSlotId,
          discountCode: discountCode || null,
          userAddress: selectedAddressId,
          userCar: selectedCarId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم تأكيد الحجز بنجاح",
        });
        router.push("/main/orders");
      } else {
        Toast.show({
          type: "error",
          text1: "فشل تأكيد الحجز",
        });
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تأكيد الحجز",
      });
    } finally {
      setProcessing(false);
    }
  };

  const goBack = () => {
    router.push("/main/cart");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
      </SafeAreaView>
    );
  }

  if (!cartItem) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>لم يتم العثور على العنصر</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>العودة</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#0A3981" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل الحجز</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Service Provider Info */}
        <View style={styles.providerContainer}>
          <Image
            source={
              cartItem.brandLogo
                ? { uri: `${baseImageUrl}${cartItem.brandLogo}` }
                : defaultServiceProviderImage
            }
            style={styles.providerLogo}
            resizeMode="contain"
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>
              {cartItem.brandNameAr || "Name - الاسم"}
            </Text>
          </View>
        </View>

        {/* Address Selector */}
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
        />

        {/* Car Selector */}
        <CarSelector
          selectedCarId={selectedCarId}
          onSelectCar={setSelectedCarId}
        />

        {/* Time Slot Selector */}
        <TimeSlotSelector
          brandId={brandIdNum}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
        />

        {/* Extra Services */}
        {cartItem.itemDto?.itemExtraDtos &&
          cartItem.itemDto.itemExtraDtos.length > 0 && (
            <View style={styles.extrasContainer}>
              <Text style={styles.sectionTitle}>خدمات إضافية</Text>
              {cartItem.itemDto.itemExtraDtos.map((extra: any) => (
                <View key={extra.itemExtraId} style={styles.extraItem}>
                  <View style={styles.checkboxChecked}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <Text style={styles.extraName}>{extra.itemExtraNameAr}</Text>
                  <Text style={styles.extraPrice}>
                    {extra.itemExtraPrice} {"ر.س"}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* Discount Input */}
        <DiscountInput
          brandId={brandIdNum}
          onApplyDiscount={handleApplyDiscount}
        />

        {/* Price Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
            <Text style={styles.summaryValue}>
              {calculateSubtotal().toFixed(2)} {"ر.س"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.discountLabelContainer}>
              <Text style={styles.summaryLabel}>الخصم</Text>
              {discountType && (
                <Text style={styles.discountType}>
                  {discountType === "PERCENTAGE"
                    ? `${discountAmount}%`
                    : `${discountAmount} ر.س`}
                </Text>
              )}
            </View>
            <Text style={styles.discountValue}>
              -{calculateDiscount().toFixed(2)} {"ر.س"}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>الإجمالي</Text>
            <Text style={styles.totalValue}>
              {calculateTotal().toFixed(2)} {"ر.س"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, processing && styles.disabledButton]}
          onPress={handleConfirmBooking}
          disabled={processing}
          activeOpacity={0.7}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>تأكيد الحجز</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#0A3981",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  extrasContainer: {
    marginBottom: 20,
  },
  extraItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#0A3981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
  extraName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginHorizontal: 12,
    textAlign: "right",
  },
  extraPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A3981",
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  discountLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountType: {
    fontSize: 12,
    color: "#0A3981",
    marginLeft: 8,
  },
  discountValue: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  confirmButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
