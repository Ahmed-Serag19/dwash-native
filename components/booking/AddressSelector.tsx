import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MapPin, Plus } from "lucide-react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onSelectAddress: (addressId: number) => void;
}

export default function AddressSelector({
  selectedAddressId,
  onSelectAddress,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      const response = await axios.get(apiEndpoints.getAddresses, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAddresses(response.data.content || []);
        // Auto-select first address if none selected
        if (response.data.content?.length > 0 && !selectedAddressId) {
          onSelectAddress(response.data.content[0].userAddressId);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل العناوين",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToAddAddress = () => {
    router.push("/main/profile");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0A3981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>موقع سيارتك</Text>

      {addresses.length === 0 ? (
        <View style={styles.emptyAddressContainer}>
          <Text style={styles.emptyText}>لا توجد عناوين مضافة</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToAddAddress}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.addButtonText}>إضافة عنوان</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.addressesContainer}>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.userAddressId}
              style={[
                styles.addressCard,
                selectedAddressId === address.userAddressId &&
                  styles.selectedAddressCard,
              ]}
              onPress={() => onSelectAddress(address.userAddressId)}
            >
              <View style={styles.addressInfo}>
                <MapPin size={20} color="#0A3981" style={styles.mapIcon} />
                <View style={styles.addressDetails}>
                  <Text style={styles.addressTitle}>
                    {address.addressTitle}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.cityNameAr || address.cityAr},{" "}
                    {address.districtNameAr || address.districtAr}
                  </Text>
                </View>
              </View>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedAddressId === address.userAddressId && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyAddressContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  emptyText: {
    marginBottom: 12,
    color: "#666",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
  addressesContainer: {
    gap: 12,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedAddressCard: {
    borderColor: "#0A3981",
    borderWidth: 2,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mapIcon: {
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  addressText: {
    fontSize: 12,
    color: "#666",
  },
  radioContainer: {
    marginLeft: 8,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0A3981",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0A3981",
  },
});
