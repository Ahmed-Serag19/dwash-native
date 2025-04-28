import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";
import ColorSelector from "./ColorSelector";
import { Picker } from "@react-native-picker/picker";

interface CarFormData {
  carModelId: number;
  carBrandId: number;
  carPlateNo: string;
  carColorId: number;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => Promise<void>;
}

export default function CarForm({ onSubmit }: CarFormProps) {
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
  } = useForm<CarFormData>({
    defaultValues: {
      carBrandId: 0,
      carModelId: 0,
      carColorId: 0,
      carPlateNo: "",
    },
  });

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

  const handleFormSubmit = async (data: CarFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.errorText}>{errors.carBrandId.message}</Text>
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
          <Text style={styles.errorText}>{errors.carModelId.message}</Text>
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
          <Text style={styles.errorText}>{errors.carColorId.message}</Text>
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
          <Text style={styles.errorText}>{errors.carPlateNo.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit(handleFormSubmit)}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>إضافة</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
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
    fontSize: 16,
    backgroundColor: "#fff",
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
