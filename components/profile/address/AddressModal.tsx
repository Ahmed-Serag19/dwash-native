"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AddressForm from "./AddressForm";
import LocationSelector from "./LocationSelector";

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
            {/* Address Form (Title, City, District) */}
            <AddressForm
              control={control}
              errors={errors}
              cities={cities}
              districts={districts}
              loadingCities={loadingCities}
              loadingDistricts={loadingDistricts}
              selectedCityId={selectedCityId}
            />

            {/* Location Selector */}
            <LocationSelector
              control={control}
              errors={errors}
              setValue={setValue}
              locationLoading={locationLoading}
              setLocationLoading={setLocationLoading}
            />
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
});
