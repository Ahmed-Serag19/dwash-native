import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { apiEndpoints } from "@/constants/endPoints";
import AddressCard from "./AddressCard";
import AddressModal from "./address/AddressModal";
import ConfirmationModal from "./ConfirmationModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus } from "lucide-react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface AddressManagementProps {
  addresses: any[];
  onSuccess: () => void;
}

export default function AddressManagement({
  addresses,
  onSuccess,
}: AddressManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<any | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddAddress = async (data: any) => {
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

      const response = await axios.post(apiEndpoints.addAddress, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تمت إضافة العنوان بنجاح",
        });
        setIsAddModalOpen(false);
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل إضافة العنوان",
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء إضافة العنوان",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async (addressId: number, data: any) => {
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

      const response = await axios.put(
        apiEndpoints.editAddress(addressId),
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم تحديث العنوان بنجاح",
        });
        setEditingAddress(null);
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل تحديث العنوان",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحديث العنوان",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

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

      const response = await axios.delete(
        apiEndpoints.deleteAddress(addressToDelete.userAddressId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم حذف العنوان بنجاح",
        });
        setAddressToDelete(null);
        setIsConfirmModalOpen(false);
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: "فشل حذف العنوان",
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء حذف العنوان",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (address: any) => {
    setAddressToDelete(address);
    setIsConfirmModalOpen(true);
  };

  return (
    <View style={styles.container}>
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا توجد عناوين مضافة</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.userAddressId.toString()}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onEdit={() => setEditingAddress(item)}
              onDelete={() => openDeleteConfirmation(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
        />
      )}

      {/* Add Address Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalOpen(true)}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>إضافة عنوان جديد</Text>
      </TouchableOpacity>

      {/* Add Address Modal */}
      <AddressModal
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة عنوان جديد"
        onSubmit={handleAddAddress}
        loading={loading}
      />

      {/* Edit Address Modal */}
      {editingAddress && (
        <AddressModal
          isVisible={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          title="تعديل العنوان"
          initialData={{
            addressTitle: editingAddress.addressTitle,
            cityId: editingAddress.cityId,
            districtId: editingAddress.districtId,
            latitude: editingAddress.latitude,
            longitude: editingAddress.longitude,
          }}
          onSubmit={(data) =>
            handleEditAddress(editingAddress.userAddressId, data)
          }
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteAddress}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا العنوان؟"
        confirmText="نعم"
        cancelText="لا"
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  separator: {
    height: 16,
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
    marginTop: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
