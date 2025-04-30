"use client";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface AddressFormProps {
  control: any;
  errors: any;
  cities: any[];
  districts: any[];
  loadingCities: boolean;
  loadingDistricts: boolean;
  selectedCityId: string | number;
}

export default function AddressForm({
  control,
  errors,
  cities,
  districts,
  loadingCities,
  loadingDistricts,
  selectedCityId,
}: AddressFormProps) {
  return (
    <>
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
                      label={city.cityNameAr}
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
                      label={district.districtNameAr}
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
    </>
  );
}

const styles = StyleSheet.create({
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
});
