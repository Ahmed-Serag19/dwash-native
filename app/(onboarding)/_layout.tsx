import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
