import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";

interface AddToCartParams {
  serviceId: number;
  extraServices: number[];
}

export async function addToCart(params: AddToCartParams) {
  const { serviceId, extraServices } = params;
  let token = null;
  try {
    token = await AsyncStorage.getItem("accessToken");
  } catch (e) {
    console.error("Error reading token:", e);
  }

  if (!token) {
    Toast.show({ type: "error", text1: "يجب تسجيل الدخول أولاً" });
    return { success: false };
  }

  try {
    const response = await axios.post(
      apiEndpoints.addToCart,
      { serviceId, extraServices },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      Toast.show({ type: "success", text1: "تمت الإضافة إلى السلة بنجاح" });
      return { success: true };
    } else {
      const errMsg =
        response.data.messageAr || "حدث خطأ أثناء إضافة الخدمة إلى السلة";
      Toast.show({ type: "error", text1: errMsg });
      return { success: false };
    }
  } catch (error: any) {
    console.error("Error in addToCart:", error);
    if (axios.isAxiosError(error)) {
      const msg =
        (error.response?.data?.messageAr as string) ||
        (error.response?.data?.messageEn as string) ||
        "حدث خطأ أثناء إضافة الخدمة إلى السلة";
      if (msg.toLowerCase().includes("already exist")) {
        Toast.show({
          type: "error",
          text1: "الخدمة موجودة بالفعل في السلة",
        });
      } else {
        Toast.show({ type: "error", text1: msg });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "حدث خطأ غير متوقع أثناء إضافة الخدمة إلى السلة",
      });
    }
    return { success: false };
  }
}
