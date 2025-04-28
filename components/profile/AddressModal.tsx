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
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Picker } from "@react-native-picker/picker";
import { MapPin } from "lucide-react-native";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function AddressModal({
  isVisible,
  onClose,
  title,
  initialData,
  onSubmit,
  loading,
}: AddressModalProps) {
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressTitle: initialData?.addressTitle || "",
      cityId: initialData?.cityId || "",
      districtId: initialData?.districtId || "",
      latitude: initialData?.latitude?.toString() || "",
      longitude: initialData?.longitude?.toString() || "",
    },
  });

  const selectedCityId = watch("cityId");

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.get(apiEndpoints.getCities);
        if (response.data.success) {
          setCities(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (!selectedCityId) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const response = await axios.get(
          apiEndpoints.getDistrict(selectedCityId)
        );
        if (response.data.success) {
          setDistricts(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedCityId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      reset({
        addressTitle: initialData?.addressTitle || "",
        cityId: initialData?.cityId || "",
        districtId: initialData?.districtId || "",
        latitude: initialData?.latitude?.toString() || "",
        longitude: initialData?.longitude?.toString() || "",
      });
    }
  }, [isVisible, initialData, reset]);

  // Get current location
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("تنبيه", "لم يتم منح إذن الوصول إلى الموقع");
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setValue("latitude", location.coords.latitude.toString());
      setValue("longitude", location.coords.longitude.toString());
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء محاولة الحصول على الموقع الحالي");
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Address Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>عنوان المكان</Text>
              <Controller
                control={control}
                rules={{ required: "عنوان المكان مطلوب" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="مثال: المنزل، العمل"
                    textAlign="right"
                  />
                )}
                name="addressTitle"
              />
              {errors.addressTitle && (
                <Text style={styles.errorText}>
                  {errors.addressTitle.message as string}
                </Text>
              )}
            </View>

            {/* City */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المدينة</Text>
              {loadingCities ? (
                <ActivityIndicator size="small" color="#0A3981" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Controller
                    control={control}
                    rules={{ required: "المدينة مطلوبة" }}
                    render={({ field: { onChange, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                        dropdownIconColor="#0A3981"
                      >
                        <Picker.Item label="اختر المدينة" value="" />
                        {cities.map((city) => (
                          <Picker.Item
                            key={city.cityId}
                            label={city.cityNameAr} // Changed from cityAr to cityNameAr
                            value={city.cityId}
                          />
                        ))}
                      </Picker>
                    )}
                    name="cityId"
                  />
                </View>
              )}
              {errors.cityId && (
                <Text style={styles.errorText}>
                  {errors.cityId.message as string}
                </Text>
              )}
            </View>

            {/* District */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>الحي</Text>
              {loadingDistricts ? (
                <ActivityIndicator size="small" color="#0A3981" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Controller
                    control={control}
                    rules={{ required: "الحي مطلوب" }}
                    render={({ field: { onChange, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                        enabled={!!selectedCityId}
                        dropdownIconColor="#0A3981"
                      >
                        <Picker.Item label="اختر الحي" value="" />
                        {districts.map((district) => (
                          <Picker.Item
                            key={district.districtId}
                            label={district.districtNameAr} // Changed from districtAr to districtNameAr
                            value={district.districtId}
                          />
                        ))}
                      </Picker>
                    )}
                    name="districtId"
                  />
                </View>
              )}
              {errors.districtId && (
                <Text style={styles.errorText}>
                  {errors.districtId.message as string}
                </Text>
              )}
            </View>

            {/* Location Fields with Get Current Location Button */}
            <View style={styles.locationContainer}>
              <Text style={styles.label}>الموقع</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MapPin size={16} color="#fff" />
                    <Text style={styles.locationButtonText}>
                      استخدام الموقع الحالي
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.coordinatesContainer}>
                {/* Latitude */}
                <View style={styles.coordinateField}>
                  <Text style={styles.coordinateLabel}>خط العرض</Text>
                  <Controller
                    control={control}
                    rules={{
                      required: "خط العرض مطلوب",
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: "يرجى إدخال قيمة صحيحة",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.coordinateInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="مثال: 24.7136"
                        keyboardType="numeric"
                        textAlign="right"
                      />
                    )}
                    name="latitude"
                  />
                  {errors.latitude && (
                    <Text style={styles.errorText}>
                      {errors.latitude.message as string}
                    </Text>
                  )}
                </View>

                {/* Longitude */}
                <View style={styles.coordinateField}>
                  <Text style={styles.coordinateLabel}>خط الطول</Text>
                  <Controller
                    control={control}
                    rules={{
                      required: "خط الطول مطلوب",
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: "يرجى إدخال قيمة صحيحة",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.coordinateInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="مثال: 46.6753"
                        keyboardType="numeric"
                        textAlign="right"
                      />
                    )}
                    name="longitude"
                  />
                  {errors.longitude && (
                    <Text style={styles.errorText}>
                      {errors.longitude.message as string}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
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
    paddingHorizontal: 14,
    fontSize: isSmallScreen ? 14 : 16,
    backgroundColor: "#fff",
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
    height: 60,
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
    borderRadius: 5,
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
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  // New styles for location feature
  locationContainer: {
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: "#0A3981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  coordinatesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coordinateField: {
    width: "48%",
  },
  coordinateLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
    textAlign: "right",
  },
  coordinateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: isSmallScreen ? 14 : 16,
    backgroundColor: "#fff",
  },
});
