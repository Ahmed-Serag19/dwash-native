import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";
import OrderCardMobile from "@/components/orders/OrderCard";

import { OrderData } from "@/interfaces/interfaces";

const { width } = Dimensions.get("window");

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<"current" | "closed">("current");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const response = await axios.get(apiEndpoints.getOrders(1, 100), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const orders = response.data.content.data;

        const current = orders.filter(
          (order: OrderData) =>
            ![
              "REJECTED",
              "COMPLETED",
              "COMPLETED_BY_ADMIN",
              "CANCELLED_BY_ADMIN",
              "CANCELLED",
              "REFUNDED",
            ].includes(order.request.statusName)
        );

        const closed = orders.filter((order: OrderData) =>
          [
            "REJECTED",
            "COMPLETED",
            "COMPLETED_BY_ADMIN",
            "CANCELLED_BY_ADMIN",
            "CANCELLED",
            "REFUNDED",
          ].includes(order.request.statusName)
        );

        setCurrentOrders(current);
        setClosedOrders(closed);
      } else {
        Toast.show({ type: "error", text1: response.data.messageAr });
      }
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "messageAr" in err
          ? (err as any).messageAr
          : "An error occurred";
      Toast.show({ type: "error", text1: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const response = await axios.put(
        apiEndpoints.cancelOrder(orderId),
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Toast.show({ type: "success", text1: "تم الغاء الطلب" });
        fetchOrders();
      } else {
        Toast.show({ type: "error", text1: response.data.messageAr });
      }
    } catch {
      Toast.show({ type: "error", text1: "فشل الغاء الطلب" });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>الطلبات</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.tabActive]}
          onPress={() => setActiveTab("current")}
        >
          <Text style={styles.tabText}>الطلبات الحالية</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "closed" && styles.tabActive]}
          onPress={() => setActiveTab("closed")}
        >
          <Text style={styles.tabText}>الطلبات المغلقة</Text>
        </TouchableOpacity>
      </View>

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
                onAddReview={(id, rating, desc) => {
                  // implement review logic here
                }}
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
    color: "white",
    fontWeight: "600",
  },
  ordersList: {
    gap: 16,
  },
});
