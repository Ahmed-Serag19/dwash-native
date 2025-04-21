import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="Login" />
          <Stack.Screen name="Register" />
        </Stack>
        <Toast />
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
