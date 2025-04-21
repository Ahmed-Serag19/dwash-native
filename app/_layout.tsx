import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(loading)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
