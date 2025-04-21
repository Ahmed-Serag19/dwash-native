import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { TextInput } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { apiEndpoints } from "@/constants/endPoints";
import OTPInput from "@/components/OTPInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "@/constants/images";

type FormData = {
  phoneNumber: string;
};

export default function Login() {
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  // Add responsive handling for screen size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const phoneRegex = /^05\d{8}$/;

  const handlePhoneSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      const apiUrl = apiEndpoints.LoginInitiate(data.phoneNumber, "AR");

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
        setPhoneNumber(data.phoneNumber);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground source={images.authBg} style={styles.backgroundImage}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingHorizontal: screenWidth < 380 ? 15 : 20 },
            ]}
          >
            <View
              style={[
                styles.logoContainer,
                { marginBottom: screenWidth < 380 ? 30 : 60 },
              ]}
            >
              <Image
                source={images.darkLogo}
                style={[styles.logo, { width: screenWidth < 380 ? 120 : 140 }]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.title,
                  { fontSize: screenWidth < 380 ? 20 : 24 },
                ]}
              >
                D. Wash
              </Text>
            </View>
            {!isOTP ? (
              <View
                style={[
                  styles.formContainer,
                  { width: screenWidth < 380 ? "95%" : "85%" },
                ]}
              >
                <Text style={styles.inputLabel}>ادخل رقم الجوال</Text>
                <View style={styles.phoneInputContainer}>
                  <View
                    style={[
                      styles.flagContainer,
                      { width: screenWidth < 380 ? 90 : 100 },
                    ]}
                  >
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
                        value: phoneRegex,
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
                  style={[
                    styles.button,
                    loading && styles.buttonDisabled,
                    { height: screenWidth < 380 ? 45 : 50 },
                  ]}
                  onPress={handleSubmit(handlePhoneSubmit)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { fontSize: screenWidth < 380 ? 16 : 18 },
                    ]}
                  >
                    {loading ? "جاري التحميل..." : "تسجيل الدخول"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                  <Link href="/(auth)/Register" asChild>
                    <TouchableOpacity>
                      <Text style={styles.link}>تسجيل جديد</Text>
                    </TouchableOpacity>
                  </Link>
                  <Text style={styles.linkText}> لا تملك حساب؟</Text>
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
    width: "95%",
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
    // position: "absolute",
    // left: 0,
    // top: 0,
    // right: 0,
  },
});
