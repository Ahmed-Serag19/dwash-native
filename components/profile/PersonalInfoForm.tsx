import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toast from "react-native-toast-message";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface PersonalInfoFormProps {
  user: any;
  onSuccess: () => void;
}

export default function PersonalInfoForm({
  user,
  onSuccess,
}: PersonalInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.nameEn || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email || "");
      setValue("name", user.nameEn || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
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

      const response = await axios.put(apiEndpoints.editProfile, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم تحديث الملف الشخصي بنجاح",
        });
        onSuccess();
        setModalVisible(false); // Close modal on success
      } else {
        Toast.show({
          type: "error",
          text1: "فشل تحديث الملف الشخصي",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحديث الملف الشخصي",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Name - Disabled */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>الاسم</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.nameEn || ""}
          placeholder="أدخل الاسم الكامل"
          textAlign="right"
          editable={false}
        />
      </View>

      {/* Email - Disabled */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email || ""}
          placeholder="أدخل البريد الإلكتروني"
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="right"
          editable={false}
        />
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.button} onPress={openEditModal}>
        <Text style={styles.buttonText}>تعديل المعلومات</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تعديل المعلومات</Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>الاسم</Text>
              <Controller
                control={control}
                rules={{
                  required: "الاسم مطلوب",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="أدخل الاسم الكامل"
                    textAlign="right"
                  />
                )}
                name="name"
              />
              {errors.name && (
                <Text style={styles.errorText}>
                  {errors.name.message as string}
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
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
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="أدخل البريد الإلكتروني"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textAlign="right"
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.errorText}>
                  {errors.email.message as string}
                </Text>
              )}
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>إلغاء</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>حفظ</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    textAlign: "right",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: isSmallScreen ? 14 : 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "rgba(240, 65, 19, 0.8)",
  },
  saveButton: {
    backgroundColor: "#0A3981",
  },
  modalButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
});
