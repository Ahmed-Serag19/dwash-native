import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface DiscountInputProps {
  brandId: number;
  onApplyDiscount: (
    discountCode: string,
    discountAmount: number,
    discountType: string
  ) => void;
}

export default function DiscountInput({
  brandId,
  onApplyDiscount,
}: DiscountInputProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      Toast.show({
        type: "error",
        text1: "الرجاء إدخال كود الخصم",
      });
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${apiEndpoints.validateDiscount}?discountCode=${discountCode}&brandId=${brandId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const discount = response.data.content;
        onApplyDiscount(
          discountCode,
          discount.discountAmount,
          discount.discountType
        );
        Toast.show({
          type: "success",
          text1: "تم تطبيق الخصم بنجاح",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "كود الخصم غير صالح",
        });
      }
    } catch (error) {
      console.error("Error validating discount:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء التحقق من كود الخصم",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>خدمات إضافية</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="كود الخصم"
          value={discountCode}
          onChangeText={setDiscountCode}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleApplyDiscount}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>تفعيل</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
