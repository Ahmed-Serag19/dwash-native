"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Controller } from "react-hook-form";
import { MapPin, Map } from "lucide-react-native";
import * as Location from "expo-location";
import LocationMapModal from "./LocationMapModal";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface LocationSelectorProps {
  control: any;
  errors: any;
  setValue: any;
  locationLoading: boolean;
  setLocationLoading: (loading: boolean) => void;
}

export default function LocationSelector({
  control,
  errors,
  setValue,
  locationLoading,
  setLocationLoading,
}: LocationSelectorProps) {
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const latitude = control._formValues.latitude;
  const longitude = control._formValues.longitude;

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("لم يتم منح إذن الوصول إلى الموقع");
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setValue("latitude", location.coords.latitude.toString());
      setValue("longitude", location.coords.longitude.toString());
    } catch (error) {
      console.error("Error getting location:", error);
      alert("حدث خطأ أثناء محاولة الحصول على الموقع الحالي");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSelectLocation = (latitude: number, longitude: number) => {
    setValue("latitude", latitude.toString());
    setValue("longitude", longitude.toString());
  };

  return (
    <View style={styles.locationContainer}>
      <Text style={styles.label}>الموقع</Text>

      <View style={styles.locationButtonsContainer}>
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
              <Text style={styles.locationButtonText}>الموقع الحالي</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setMapModalVisible(true)}
          disabled={locationLoading}
        >
          <Map size={16} color="#fff" />
          <Text style={styles.locationButtonText}>تحديد موقع آخر</Text>
        </TouchableOpacity>
      </View>

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

      <LocationMapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={handleSelectLocation}
        initialLatitude={latitude}
        initialLongitude={longitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    textAlign: "right",
  },
  locationButtonsContainer: {
    // display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  locationButton: {
    backgroundColor: "#0A3981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  mapButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});
