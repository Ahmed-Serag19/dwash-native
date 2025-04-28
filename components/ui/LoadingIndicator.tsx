import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "جاري التحميل...",
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0A3981" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: "#0A3981",
  },
});
