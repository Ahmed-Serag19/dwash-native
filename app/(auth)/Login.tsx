import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import { images } from "@/constants/images";
import OTPInput from "@/components/OTPInput";

type FormData = {
  phoneNumber: string;
};

export default function Login() {
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handlePhoneSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      // Format phone number to match API expectations (remove leading 0)
      const formattedNumber = data.phoneNumber;

      const apiUrl = apiEndpoints.LoginInitiate(formattedNumber, "AR");

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم إرسال رمز التحقق",
        });
        setPhoneNumber(formattedNumber);
        setIsOTP(true);
      } else {
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "حدث خطأ أثناء تسجيل الدخول",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.messageAr || "حدث خطأ أثناء تسجيل الدخول",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/(auth)/Register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground
          source={images.authBg}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={images.darkLogo}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>D. Wash</Text>
            </View>

            {!isOTP ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>ادخل رقم الجوال</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.flagContainer}>
                    <Image
                      source={require("@/assets/images/saudi-flag.png")}
                      style={styles.flag}
                      resizeMode="contain"
                    />
                    <Text style={styles.countryCode}>+966</Text>
                  </View>
                  <Controller
                    control={control}
                    rules={{
                      required: "رقم الهاتف مطلوب",
                      pattern: {
                        value: /^05\d{8}$/,
                        message:
                          "رقم الهاتف غير صالح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.phoneInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="05********"
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    )}
                    name="phoneNumber"
                  />
                </View>
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>
                    {errors.phoneNumber.message}
                  </Text>
                )}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSubmit(handlePhoneSubmit)}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>تسجيل الدخول</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                  <TouchableOpacity onPress={navigateToRegister}>
                    <Text style={styles.link}>تسجيل جديد</Text>
                  </TouchableOpacity>
                  <Text style={styles.linkText}>لا تملك حساب؟</Text>
                </View>
              </View>
            ) : (
              <OTPInput phoneNumber={phoneNumber} isRegister={false} />
            )}
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 140,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a237e",
  },
  formContainer: {
    width: "85%",
    alignItems: "center",
  },
  inputLabel: {
    alignSelf: "flex-end",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  phoneInputContainer: {
    flexDirection: "row",
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#656565",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    width: 100,
  },
  flag: {
    width: 34,
    height: 24,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: "left",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#0A3981",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    height: "45%",
  },
});
