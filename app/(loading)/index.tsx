import { useEffect } from "react";
import { View, Text, Image, ImageBackground, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      try {
        const token = await AsyncStorage.getItem("accessToken");

        if (!token) {
          await delay(2500);
          router.replace("/(onboarding)/onboarding");
          return;
        }

        const response = await axios.get(apiEndpoints.getProfile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          await delay(2500);
          router.replace("/main" as any);
        } else {
          await AsyncStorage.removeItem("accessToken");
          await delay(2500);
          router.replace("/(onboarding)/onboarding");
        }
      } catch (error) {
        console.log("Error checking token:", error);
        await AsyncStorage.removeItem("accessToken");
        await delay(2500);
        router.replace("/(onboarding)/onboarding");
      }
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ImageBackground
        source={images.loadingBg}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center">
          <View className="absolute top-3/5 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
            <Image source={images.logo} className="h-14 w-44" />
            <Text className="text-white text-3xl mt-3">D. Wash</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
