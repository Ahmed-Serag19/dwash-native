import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Stack>
        <Stack.Screen name="(loading)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} />
        <Stack.Screen
          name="(booking-details)"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toast />
    </UserProvider>
  );
}
