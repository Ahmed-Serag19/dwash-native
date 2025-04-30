import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function PaymentSuccess() {
  useEffect(() => {
    Toast.show({
      type: "success",
      text1: "تم الدفع بنجاح",
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: "#007bff" }]}>تم الدفع بنجاح</Text>
      <Ionicons name="checkmark-circle" size={60} color="green" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/main/orders")}
      >
        <Text style={styles.buttonText}>عرض الطلبات</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
