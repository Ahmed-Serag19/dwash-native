import type React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";
import OTPDigitInput from "./OTPDigitInput";
import AuthButton from "./AuthButton";

interface OTPVerificationProps {
  phoneNumber: string;
  isRegister?: boolean;
  userData?: {
    fullName?: string;
    email?: string;
  };
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  isRegister,
  userData,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { getUser } = useUser();

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const updateUserProfile = async (token: string) => {
    if (!userData?.fullName && !userData?.email) return;

    setUpdatingProfile(true);
    try {
      console.log("Updating profile with:", userData);
      const response = await axios.put(
        apiEndpoints.editProfile,
        {
          name: userData?.fullName,
          email: userData?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Profile updated successfully:", response.data);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await getUser();
      } else {
        console.log("Failed to update profile:", response.data);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleOTPSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      Toast.show({
        type: "error",
        text1: "الرجاء إدخال رمز التحقق المكون من 6 أرقام",
      });
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const apiUrl = isRegister
        ? apiEndpoints.RegisterFinalize(otpValue, phoneNumber)
        : apiEndpoints.LoginFinalize(otpValue, phoneNumber);

      const response = await axios.post(apiUrl, {});

      if (response.data.success) {
        const token = response.data.content?.token;

        if (token) {
          await AsyncStorage.setItem("accessToken", token);

          if (isRegister && userData) {
            await updateUserProfile(token);
          } else {
            await getUser();
          }

          Toast.show({
            type: "success",
            text1: isRegister ? "تم التسجيل بنجاح" : "تم تسجيل الدخول بنجاح",
          });

          setTimeout(() => {
            router.replace("/main" as any);
          }, 1000);
        } else if (
          response.data.messageAr === "Confirmation code doesn't match"
        ) {
          Toast.show({
            type: "error",
            text1: "رمز التحقق غير صحيح",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "لم يتم العثور على رمز الوصول",
          });
        }
      } else if (
        response.data.messageAr === "Confirmation code has been expired"
      ) {
        Toast.show({
          type: "error",
          text1: "انتهت صلاحية رمز التحقق",
        });
        router.replace("/(auth)/Login");
      } else {
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "حدث خطأ أثناء التحقق",
        });
      }
    } catch (error: any) {
      console.log(error);
      if (
        error.response?.data?.messageAr === "Confirmation code doesn't match"
      ) {
        Toast.show({
          type: "error",
          text1: "رمز التحقق غير صحيح",
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء التحقق",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-[90%] items-center">
      <Text className="text-2xl font-semibold text-black mb-1 self-center">
        رمز التحقق
      </Text>
      <Text className="text-sm text-[#666] text-center mb-8">
        فضلاً، ادخل رمز التحقق المرسل عبر الرسائل النصية
      </Text>

      <View className="w-full mb-8">
        <Text className="text-lg font-semibold mb-2 text-black text-right">
          رقم الهاتف
        </Text>
        <Text className="text-base text-[#666] p-3 bg-[#f0f0f0] rounded-lg border border-[#656565]">
          {phoneNumber}
        </Text>
      </View>

      <OTPDigitInput
        value={otp}
        onChange={handleOtpChange}
        onKeyPress={handleKeyPress}
      />

      <AuthButton
        onPress={handleOTPSubmit}
        loading={loading || updatingProfile}
        text="تحقق"
        loadingText={loading ? "جاري التحقق..." : "جاري تحديث الملف..."}
      />

      <View className="flex-row mt-5 gap-1">
        <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
          <Text className="text-base text-[#1a237e] font-semibold">
            تسجيل دخول
          </Text>
        </TouchableOpacity>

        <Text className="text-base text-[#333] font-semibold">
          رقم تليفون خطأ؟
        </Text>
      </View>
    </View>
  );
};

export default OTPVerification;
