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
  fullName: string;
  email: string;
};

export default function Register() {
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userData, setUserData] = useState<{
    fullName?: string;
    email?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const handleRegisterSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userPhoneNumber = data.phoneNumber; // Use directly from form data

      const apiUrl = apiEndpoints.RegisterInitiate(userPhoneNumber, "AR");

      const response = await axios.post(
        apiUrl,
        {}
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم إرسال رمز التحقق",
        });

        setPhoneNumber(userPhoneNumber);
        setUserData({
          fullName: data.fullName,
          email: data.email,
        });
        setIsOTP(true);
      } else {
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "حدث خطأ أثناء التسجيل",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.messageAr || "حدث خطأ أثناء التسجيل",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/(auth)/Login");
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
                    defaultValue=""
                  />
                </View>
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>
                    {errors.phoneNumber.message}
                  </Text>
                )}

                {/* Rest of your form inputs remain the same */}
                <Text style={styles.inputLabel}>الاسم الكامل</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "الاسم الكامل مطلوب",
                    minLength: {
                      value: 3,
                      message: "يجب أن يكون الاسم على الأقل 3 أحرف",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="أدخل الاسم الكامل"
                    />
                  )}
                  name="fullName"
                  defaultValue=""
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>
                    {errors.fullName.message}
                  </Text>
                )}

                <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "البريد الإلكتروني غير صالح",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="أدخل البريد الإلكتروني"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                  name="email"
                  defaultValue=""
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSubmit(handleRegisterSubmit)}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>تسجيل جديد</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={styles.link}>تسجيل الدخول</Text>
                  </TouchableOpacity>
                  <Text style={styles.linkText}>هل لديك حساب؟</Text>
                </View>
              </View>
            ) : (
              <OTPInput
                phoneNumber={phoneNumber}
                isRegister={true}
                userData={userData}
              />
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
  textInput: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#656565",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    textAlign: "right",
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
