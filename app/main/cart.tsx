import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import CartItemAccordion from "@/components/cart/CartItemAccordion";
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        router.push("/(auth)/Login");
        return;
      }

      const response = await axios.get(apiEndpoints.getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCartItems(response.data.content || []);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل سلة التسوق",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
      return () => {};
    }, [])
  );

  const handleDeleteItem = async (invoiceId: number, itemId: number) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      const response = await axios.delete(
        `${apiEndpoints.deleteFromCart}?invoiceId=${invoiceId}&itemId=${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم حذف العنصر بنجاح",
        });
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء حذف العنصر",
      });
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#0A3981" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>سلة التسوق</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A3981" />
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>سلة التسوق فارغة</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/main/home")}
          >
            <Text style={styles.browseButtonText}>تصفح الخدمات</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {cartItems.map((item) => (
            <CartItemAccordion
              key={item.invoiceId}
              item={item}
              onDelete={handleDeleteItem}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
