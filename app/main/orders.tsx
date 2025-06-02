import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";
import OrderCardMobile from "@/components/orders/OrderCard";
import { OrderData } from "@/interfaces/interfaces";
import { useUser } from "@/context/UserContext";

const { width } = Dimensions.get("window");
const PAGE_SIZE = 100; // you can adjust as needed

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<"current" | "closed">("current");
  const [currentOrders, setCurrentOrders] = useState<OrderData[]>([]);
  const [closedOrders, setClosedOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useUser(); // assuming your context provides `token`

  // Fetch orders from API and split into “current” vs. “closed”
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(apiEndpoints.getOrders(1, PAGE_SIZE), {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.data.success) {
        const orders: OrderData[] = response.data.content.data;

        // Status names that count as “closed”
        const closedStatuses = [
          "REJECTED",
          "COMPLETED",
          "COMPLETED_BY_ADMIN",
          "CANCELLED_BY_ADMIN",
          "CANCELLED",
          "REFUNDED",
        ];

        // Split:
        const current = orders.filter(
          (order) => !closedStatuses.includes(order.request.statusName)
        );
        const closed = orders.filter((order) =>
          closedStatuses.includes(order.request.statusName)
        );

        setCurrentOrders(current);
        setClosedOrders(closed);
      } else {
        // Show Arabic message if available, otherwise a generic one
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "فشل في جلب الطلبات",
        });
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.messageAr || "حدث خطأ أثناء جلب الطلبات";
      Toast.show({ type: "error", text1: errMsg });
    } finally {
      setLoading(false);
    }
  };

  // Pull‐to‐refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Called when user submits a review
  const handleAddReview = async (
    requestId: number,
    appraisal: number,
    description: string
  ) => {
    try {
      const response = await axios.post(
        apiEndpoints.addReview(requestId),
        { appraisal, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم إضافة التقييم بنجاح", // “Review added successfully”
        });
        // Re-fetch to update the UI (so the “Add Review” button goes away)
        await fetchOrders();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "فشل إضافة التقييم",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        Toast.show({ type: "error", text1: "فشل إضافة التقييم" });
      }
    }
  };

  // Called when user cancels an order
  const handleCancelOrder = async (orderId: number) => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(
        apiEndpoints.cancelOrder(orderId),
        null,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تم إلغاء الطلب بنجاح", // “Order canceled successfully”
        });
        await fetchOrders();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.messageAr || "فشل إلغاء الطلب",
        });
      }
    } catch {
      Toast.show({ type: "error", text1: "فشل إلغاء الطلب" });
    }
  };

  // On first load:
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>الطلبات</Text>

      {/* Tab Buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.tabActive]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.tabTextActive,
            ]}
          >
            الطلبات الحالية
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "closed" && styles.tabActive]}
          onPress={() => setActiveTab("closed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "closed" && styles.tabTextActive,
            ]}
          >
            الطلبات المغلقة
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0A3981"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.ordersList}>
          {(activeTab === "current" ? currentOrders : closedOrders).map(
            (order) => (
              <OrderCardMobile
                key={order.invoiceId}
                order={order}
                isClosed={activeTab === "closed"}
                onCancel={() => handleCancelOrder(order.request.id)}
                onAddReview={(id, rating, desc) =>
                  handleAddReview(id, rating, desc)
                }
              />
            )
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A3981",
    textAlign: "center",
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  tabActive: {
    backgroundColor: "#0A3981",
  },
  tabText: {
    color: "#333",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  ordersList: {
    gap: 16,
  },
});
