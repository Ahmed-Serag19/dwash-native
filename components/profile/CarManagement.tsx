import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { apiEndpoints } from "@/constants/endPoints";
import CarCard from "@/components/cars/CarCard";
import CarForm from "@/components/cars/CarForm";
import EditCarModal from "@/components/cars/EditCarModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus } from "lucide-react-native";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { useUser } from "@/context/UserContext";
import { Car } from "@/interfaces/interfaces";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface CarManagementProps {
  onSuccess: () => void;
  cars: Car[];
}

export default function CarManagement({ onSuccess, cars }: CarManagementProps) {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [carToDelete, setCarToDelete] = useState<any | null>(null);
  const [carToEdit, setCarToEdit] = useState<any | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { getCars, loading } = useUser();

  const handleAddCar = async (data: any) => {
    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        setActionLoading(false);
        return;
      }

      const response = await axios.post(apiEndpoints.addCar, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تمت إضافة السيارة بنجاح",
        });
        await getCars();
        setIsAddFormVisible(false);
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل إضافة السيارة",
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء إضافة السيارة",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCar = async (carId: number, data: any) => {
    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        setActionLoading(false);
        return;
      }

      const response = await axios.put(apiEndpoints.editCar(carId), data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم تحديث السيارة بنجاح",
        });
        await getCars();
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل تحديث السيارة",
        });
      }
    } catch (error) {
      console.error("Error updating car:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحديث السيارة",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        setActionLoading(false);
        return;
      }

      const response = await axios.delete(
        apiEndpoints.deleteCar(carToDelete.carId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم حذف السيارة بنجاح",
        });
        setCarToDelete(null);
        setIsConfirmModalOpen(false);
        await getCars();
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل حذف السيارة",
        });
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء حذف السيارة",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return <LoadingIndicator message="جاري تحميل السيارات..." />;
  }

  return (
    <View style={styles.container}>
      {/* Car List */}
      {cars.length > 0 ? (
        <View style={styles.carList}>
          {cars.map((car) => (
            <CarCard
              key={car.carId}
              car={car}
              onEdit={() => setCarToEdit(car)}
              onDelete={() => {
                setCarToDelete(car);
                setIsConfirmModalOpen(true);
              }}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا توجد سيارات مضافة</Text>
        </View>
      )}

      {/* Add Car Form Toggle */}
      {!isAddFormVisible ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddFormVisible(true)}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>إضافة سيارة جديدة</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>إضافة سيارة جديدة</Text>
          <CarForm onSubmit={handleAddCar} />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsAddFormVisible(false)}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Car Modal */}
      {carToEdit && (
        <EditCarModal
          isVisible={!!carToEdit}
          onClose={() => setCarToEdit(null)}
          car={carToEdit}
          onSave={handleEditCar}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCarToDelete(null);
        }}
        onConfirm={handleDeleteCar}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذه السيارة؟"
        confirmText="نعم"
        cancelText="لا"
        loading={actionLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  carList: {
    gap: 12,
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#0A3981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  formContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  formTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "600",
    color: "#0A3981",
    marginBottom: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
});
