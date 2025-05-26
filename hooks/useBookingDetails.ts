import { useState, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { fetchCart } from "@/services/bookingservice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useBookingDetails() {
  const { invoiceId } = useLocalSearchParams();
  const invoice = typeof invoiceId === "string" ? +invoiceId : 0;
  const [cartItem, setCartItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const data = await fetchCart();
      if (data.success) {
        const item = (data.content || []).find(
          (i: any) => i.invoiceId === invoice
        );
        if (!item) throw new Error("NOT_FOUND");
        setCartItem(item);
      }
    } catch (err: any) {
      switch (err.message) {
        case "AUTH_REQUIRED":
          Toast.show({ type: "error", text1: "يجب تسجيل الدخول أولاً" });
          router.push("/(auth)/Login");
          break;
        case "NOT_FOUND":
          Toast.show({ type: "error", text1: "لم يتم العثور على العنصر" });
          router.back();
          break;
        default:
          Toast.show({ type: "error", text1: "حدث خطأ أثناء تحميل التفاصيل" });
      }
    } finally {
      setLoading(false);
    }
  }, [invoice]);

  useEffect(() => {
    load();
  }, [load]);

  return { cartItem, loading };
}
