import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function PaymentLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="payment-failed" options={{ headerShown: false }} />
        <Stack.Screen name="payment-success" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
