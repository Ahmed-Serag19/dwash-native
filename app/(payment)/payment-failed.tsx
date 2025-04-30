import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function PaymentFailed() {
  useEffect(() => {
    Toast.show({
      type: "error",
      text1: "فشل الدفع",
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: "red" }]}>فشل الدفع</Text>
      <FontAwesome6 name="circle-xmark" size={60} color="red" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/main")}
      >
        <Text style={styles.buttonText}>العودة إلى الصفحة الرئيسية</Text>
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
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
