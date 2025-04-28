import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";
import ColorSelector from "./ColorSelector";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface CarFormData {
  carModelId: number;
  carBrandId: number;
  carPlateNo: string;
  carColorId: number;
}

interface EditCarModalProps {
  isVisible: boolean;
  onClose: () => void;
  car: any;
  onSave: (carId: number, data: CarFormData) => Promise<void>;
}

export default function EditCarModal({
  isVisible,
  onClose,
  car,
  onSave,
}: EditCarModalProps) {
  const [carBrands, setCarBrands] = useState<any[]>([]);
  const [carModels, setCarModels] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CarFormData>();

  const selectedBrandId = watch("carBrandId");

  // Fetch car brands on component mount
  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCarBrands);
        if (response.data.success) {
          setCarBrands(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching car brands:", error);
        Toast.show({
          type: "error",
          text1: "فشل في تحميل ماركات السيارات",
        });
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchCarBrands();
  }, []);

  // Fetch car models when brand changes
  useEffect(() => {
    if (selectedBrandId && selectedBrandId > 0) {
      const fetchCarModels = async () => {
        setLoadingModels(true);
        try {
          const response = await axios.get(
            apiEndpoints.getCarModels(selectedBrandId)
          );
          if (response.data.success) {
            setCarModels(response.data.content || []);
          }
        } catch (error) {
          console.error("Error fetching car models:", error);
          Toast.show({
            type: "error",
            text1: "فشل في تحميل موديلات السيارات",
          });
        } finally {
          setLoadingModels(false);
        }
      };

      fetchCarModels();
    } else {
      setCarModels([]);
    }
  }, [selectedBrandId]);

  // Set form values when car changes
  useEffect(() => {
    if (car) {
      setValue("carBrandId", car.carBrandId || 0);
      setValue("carModelId", car.carModelId || 0);
      setValue("carColorId", car.carColorId || 0);
      setValue("carPlateNo", car.carPlateNo || "");
    }
  }, [car, setValue]);

  const handleFormSubmit = async (data: CarFormData) => {
    if (!car) return;
    setSubmitting(true);
    try {
      await onSave(car.carId, data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تعديل السيارة</Text>
            <TouchableOpacity onPress={onClose} disabled={submitting}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Car Brand */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>ماركة السيارة</Text>
              {loadingBrands ? (
                <ActivityIndicator size="small" color="#0A3981" />
              ) : (
                <Controller
                  control={control}
                  rules={{ required: "ماركة السيارة مطلوبة" }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => {
                          onChange(itemValue);
                          setValue("carModelId", 0);
                        }}
                        style={styles.picker}
                        dropdownIconColor="#0A3981"
                      >
                        <Picker.Item label="اختر ماركة السيارة" value={0} />
                        {carBrands.map((brand) => (
                          <Picker.Item
                            key={brand.carBrandId}
                            label={brand.brandAr}
                            value={brand.carBrandId}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                  name="carBrandId"
                />
              )}
              {errors.carBrandId && (
                <Text style={styles.errorText}>
                  {errors.carBrandId.message}
                </Text>
              )}
            </View>

            {/* Car Model */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>موديل السيارة</Text>
              {loadingModels ? (
                <ActivityIndicator size="small" color="#0A3981" />
              ) : (
                <Controller
                  control={control}
                  rules={{ required: "موديل السيارة مطلوب" }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                        enabled={!!selectedBrandId && selectedBrandId !== 0}
                        dropdownIconColor="#0A3981"
                      >
                        <Picker.Item label="اختر موديل السيارة" value={0} />
                        {carModels.map((model) => (
                          <Picker.Item
                            key={model.carModelId}
                            label={model.modelAr}
                            value={model.carModelId}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                  name="carModelId"
                />
              )}
              {errors.carModelId && (
                <Text style={styles.errorText}>
                  {errors.carModelId.message}
                </Text>
              )}
            </View>

            {/* Car Color */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>لون السيارة</Text>
              <Controller
                control={control}
                rules={{ required: "لون السيارة مطلوب" }}
                render={({ field: { onChange, value } }) => (
                  <ColorSelector selectedColorId={value} onChange={onChange} />
                )}
                name="carColorId"
              />
              {errors.carColorId && (
                <Text style={styles.errorText}>
                  {errors.carColorId.message}
                </Text>
              )}
            </View>

            {/* Car Plate Number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>رقم اللوحة</Text>
              <Controller
                control={control}
                rules={{ required: "رقم اللوحة مطلوب" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="أدخل رقم اللوحة"
                    textAlign="right"
                  />
                )}
                name="carPlateNo"
              />
              {errors.carPlateNo && (
                <Text style={styles.errorText}>
                  {errors.carPlateNo.message}
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>حفظ</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "700",
    color: "#0A3981",
  },
  closeButton: {
    fontSize: 20,
    color: "#666",
  },
  formContainer: {
    padding: 16,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0A3981",
    textAlign: "right",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: 50,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#eee",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#0A3981",
    borderLeftWidth: 0.5,
    borderLeftColor: "#eee",
  },
  submitButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
