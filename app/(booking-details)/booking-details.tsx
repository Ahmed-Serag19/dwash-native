import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { BookingHeader } from "@/components/booking/BookingHeader";
import { ProviderInfo } from "@/components/booking/ProviderInfo";
import AddressSelector from "@/components/booking/AddressSelector";
import CarSelector from "@/components/booking/CarSelector";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import DiscountInput from "@/components/booking/DiscountInput";
import { ExtrasList } from "@/components/booking/ExtrasList";
import { Summary } from "@/components/booking/Summary";
import { useBookingDetails } from "@/hooks/useBookingDetails";
import Toast from "react-native-toast-message";
import { makePayment } from "@/services/bookingservice";
import { useRouter } from "expo-router";
import TermsModal from "@/components/booking/TermsModal";

export default function BookingDetailsScreen() {
  const { cartItem, loading } = useBookingDetails();
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [discount, setDiscount] = useState<{
    code: string;
    amount: number;
    type: string;
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const router = useRouter();

  const subtotal = useMemo(() => {
    if (!cartItem) return 0;
    const base = cartItem.itemDto.itemPrice || 0;
    const extrasSum = (cartItem.itemDto.itemExtraDtos || []).reduce(
      (sum: number, e: any) => sum + e.itemExtraPrice,
      0
    );
    return base + extrasSum;
  }, [cartItem]);

  const discountValue = useMemo(() => {
    if (!discount) return 0;
    return discount.type === "PERCENTAGE"
      ? (subtotal * discount.amount) / 100
      : discount.amount;
  }, [subtotal, discount]);

  const total = useMemo(
    () => subtotal - discountValue,
    [subtotal, discountValue]
  );

  const canConfirm =
    !!selectedCarId &&
    !!selectedAddressId &&
    !!selectedSlotId &&
    termsAgreed &&
    !processing;

  const onApplyDiscount = (code: string, amount: number, type: string) =>
    setDiscount({ code, amount, type });

  const confirm = async () => {
    if (!canConfirm) return;
    setProcessing(true);
    try {
      const payload = {
        paymentMethodId: 2,
        invoiceId: cartItem!.invoiceId,
        slotId: selectedSlotId!,
        discountCode: discount?.code,
        userAddress: selectedAddressId!,
        userCar: selectedCarId!,
      };
      const res = await makePayment(payload);
      if (res.success && res.content?.redirect_url) {
        Toast.show({
          type: "success",
          text1: "جارٍ فتح صفحة الدفع داخل التطبيق...",
        });
        setPaymentUrl(res.content.redirect_url);
      } else {
        Toast.show({
          type: "error",
          text1: res.messageAr || "فشل تأكيد الحجز",
        });
        router.push("/payment-failed");
      }
    } catch (err: any) {
      console.error("makePayment error:", err.response?.data || err);
      Toast.show({ type: "error", text1: "حدث خطأ أثناء تأكيد الحجز" });
      router.push("/payment-failed");
    } finally {
      setProcessing(false);
    }
  };

  // If we have a payment URL, show WebView
  if (paymentUrl) {
    return (
      <SafeAreaView style={styles.webContainer}>
        <View style={styles.webHeader}>
          <TouchableOpacity
            onPress={() => setPaymentUrl(null)}
            style={styles.webClose}
          >
            <Text style={styles.webCloseText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.webHeaderTitle}>الدفع</Text>
        </View>
        <WebView source={{ uri: paymentUrl }} style={styles.webView} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#0A3981" />
      </SafeAreaView>
    );
  }
  if (!cartItem) return null;

  const extras = cartItem.itemDto?.itemExtraDtos ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />
      <BookingHeader title="تفاصيل الحجز" />

      <ScrollView contentContainerStyle={styles.content}>
        <ProviderInfo
          logo={
            cartItem.brandLogo && `${cartItem.baseUrl}${cartItem.brandLogo}`
          }
          name={cartItem.brandNameAr}
        />
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
        />
        <CarSelector
          selectedCarId={selectedCarId}
          onSelectCar={setSelectedCarId}
        />
        <TimeSlotSelector
          brandId={cartItem.brandId}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
        />
        <ExtrasList
          extras={extras.map((e: any) => ({
            id: e.itemExtraId,
            name: e.itemExtraNameAr,
            price: e.itemExtraPrice,
          }))}
        />
        <DiscountInput
          brandId={cartItem.brandId}
          onApplyDiscount={onApplyDiscount}
        />
        <Summary
          subtotal={subtotal}
          discount={discountValue}
          total={total}
          discountLabel={
            discount?.type === "PERCENTAGE" ? `${discount.amount}%` : undefined
          }
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.termsRow}>
          <TouchableOpacity
            style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}
            onPress={() => setTermsAgreed((v) => !v)}
          />
          <Text onPress={() => setModalVisible(true)} style={styles.termsText}>
            أوافق على الشروط والأحكام
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!canConfirm || processing) && styles.disabledBtn,
          ]}
          onPress={confirm}
          disabled={!canConfirm}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmText}>تأكيد الحجز</Text>
          )}
        </TouchableOpacity>
      </View>

      <TermsModal
        visible={modalVisible}
        onAgree={() => {
          setTermsAgreed(true);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16, paddingBottom: 170 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxChecked: { backgroundColor: "#0A3981" },
  termsText: { color: "#0A3981", textDecorationLine: "underline" },
  confirmBtn: {
    backgroundColor: "#0A3981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 50,
  },
  disabledBtn: { backgroundColor: "#ccc" },
  confirmText: { color: "white", fontSize: 16, fontWeight: "bold" },
  // WebView styles
  webContainer: { flex: 1, backgroundColor: "white" },
  webHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  webClose: { padding: 8 },
  webCloseText: { fontSize: 24, color: "#333" },
  webHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  webView: { flex: 1 },
});
