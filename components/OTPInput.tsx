import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";

interface OTPInputProps {
  phoneNumber: string;
  isRegister?: boolean;
  userData?: {
    fullName?: string;
    email?: string;
  };
}

const OTPInput: React.FC<OTPInputProps> = ({
  phoneNumber,
  isRegister,
  userData,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { getUser } = useUser();

  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const updateUserProfile = async (token: string) => {
    if (!userData?.fullName && !userData?.email) return;

    setUpdatingProfile(true);
    try {
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
        // Wait a moment before fetching updated user data
        await new Promise((resolve) => setTimeout(resolve, 500));
        await getUser(); // Refresh user data after profile update
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleOTPSubmit = async () => {
    const confirmationCode = otp.join("");

    if (confirmationCode.length !== 6) {
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
        ? apiEndpoints.RegisterFinalize(confirmationCode, phoneNumber)
        : apiEndpoints.LoginFinalize(confirmationCode, phoneNumber);

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
    <View style={styles.container}>
      <Text style={styles.title}>رمز التحقق</Text>
      <Text style={styles.subtitle}>
        فضلاً، ادخل رمز التحقق المرسل عبر الرسائل النصية
      </Text>

      <View style={styles.phoneContainer}>
        <Text style={styles.phoneLabel}>رقم الهاتف</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (loading || updatingProfile) && styles.buttonDisabled,
        ]}
        onPress={handleOTPSubmit}
        disabled={loading || updatingProfile}
      >
        {loading || updatingProfile ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.buttonText}>
              {loading ? "جاري التحقق..." : "جاري تحديث الملف..."}
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>تحقق</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
          <Text style={styles.link}>تسجيل دخول</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}> رقم تليفون خطأ؟</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  phoneContainer: {
    width: "100%",
    marginBottom: 30,
  },
  phoneLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
    textAlign: "right",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#666",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#656565",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#656565",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#1a237e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 5,
  },
  linkText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "600",
  },
});

export default OTPInput;
