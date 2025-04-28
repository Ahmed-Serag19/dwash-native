import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Plus } from "lucide-react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface CarSelectorProps {
  selectedCarId: number | null;
  onSelectCar: (carId: number) => void;
}

export default function CarSelector({
  selectedCarId,
  onSelectCar,
}: CarSelectorProps) {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      const response = await axios.get(apiEndpoints.getAllCars, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCars(response.data.content || []);
        // Auto-select first car if none selected
        if (response.data.content?.length > 0 && !selectedCarId) {
          onSelectCar(response.data.content[0].carId);
        }
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل السيارات",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToAddCar = () => {
    router.push("/main/profile");
  };

  // Map color names to hex values
  const colorNameToHex: Record<string, string> = {
    Red: "#ff0000",
    Blue: "#0000ff",
    Green: "#008000",
    Black: "#000000",
    White: "#ffffff",
    Gray: "#808080",
    Silver: "#c0c0c0",
    Brown: "#a52a2a",
    Beige: "#f5f5dc",
    Orange: "#ffa500",
    Yellow: "#ffff00",
    Purple: "#800080",
    Pink: "#ffc0cb",
    Gold: "#ffd700",
    // Arabic color names
    أحمر: "#ff0000",
    أزرق: "#0000ff",
    أخضر: "#008000",
    أسود: "#000000",
    أبيض: "#ffffff",
    رمادي: "#808080",
    فضي: "#c0c0c0",
    بني: "#a52a2a",
    بيج: "#f5f5dc",
    برتقالي: "#ffa500",
    أصفر: "#ffff00",
    بنفسجي: "#800080",
    وردي: "#ffc0cb",
    ذهبي: "#ffd700",
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
      <Text style={styles.title}>سياراتك</Text>

      {cars.length === 0 ? (
        <View style={styles.emptyCarsContainer}>
          <Text style={styles.emptyText}>لا توجد سيارات مضافة</Text>
          <TouchableOpacity style={styles.addButton} onPress={navigateToAddCar}>
            <Plus size={16} color="#fff" />
            <Text style={styles.addButtonText}>إضافة سيارة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.carsContainer}>
          {cars.map((car) => {
            // Get color from either English or Arabic name
            const colorHex =
              colorNameToHex[car.carColorEn] ||
              colorNameToHex[car.carColorAr] ||
              "#ccc";

            return (
              <TouchableOpacity
                key={car.carId}
                style={[
                  styles.carCard,
                  selectedCarId === car.carId && styles.selectedCarCard,
                ]}
                onPress={() => onSelectCar(car.carId)}
              >
                <View style={styles.carInfo}>
                  <Image
                    // source={require("@/assets/images/car-icon.png")}
                    style={styles.carIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.carDetails}>
                    <Text style={styles.carName}>
                      {car.carBrandAr} {car.carModelAr}
                    </Text>
                    <Text style={styles.carPlate}>{car.carPlateNo}</Text>
                  </View>
                </View>
                <View
                  style={[styles.colorCircle, { backgroundColor: colorHex }]}
                />
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {selectedCarId === car.carId && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
  emptyCarsContainer: {
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
  carsContainer: {
    gap: 12,
  },
  carCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedCarCard: {
    borderColor: "#0A3981",
    borderWidth: 2,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  carIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  carDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  carPlate: {
    fontSize: 12,
    color: "#666",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
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
