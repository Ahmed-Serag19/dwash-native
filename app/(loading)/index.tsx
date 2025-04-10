import { useEffect } from "react";
import { View, Text, Image, ImageBackground, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(onboarding)/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
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
