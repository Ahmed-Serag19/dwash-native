import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function LoadingLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
