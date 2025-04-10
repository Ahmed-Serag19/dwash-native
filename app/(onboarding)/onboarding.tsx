import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import { images } from "@/constants/images";
const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "تخطى",
    image: images.firstSlide,
  },
  {
    key: "2",
    title: "تخطى",
    image: images.logo,
  },
  {
    key: "3",
    title: "تخطى",
    image: images.logo,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = () => {
    router.replace("/(auth)/Login");
  };

  return (
    <SafeAreaView className="flex-1 mb-10 ">
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View
            style={{
              backgroundColor: "#ccc", // Light grey for inactive dot
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 3,
              bottom: 20,
            }}
          />
        }
        activeDot={
          <View
            className="transition-all duration-200"
            style={{
              backgroundColor: "#007BFF", // Blue for active dot
              width: 45,
              height: 15,
              borderRadius: 7.5,
              marginHorizontal: 3,
              bottom: 20,
            }}
          />
        }
        onIndexChanged={(index: any) => setCurrentIndex(index)}
      >
        {slides.map((slide) => (
          <View
            key={slide.key}
            className="flex-1 justify-center items-center px-5 bg-gray-100 "
          >
            <Image
              source={slide.image}
              className={`mb-10 `}
              resizeMode="contain"
              style={{
                width: width * 1,
                height: height * 0.7,
                marginLeft: 40,
              }}
            />
            <Text
              onPress={handleSkip}
              className="text-2xl font-bold text-white px-6 py-2 rounded-lg bg-primary  text-center"
            >
              {slide.title}
            </Text>
          </View>
        ))}
      </Swiper>

      <TouchableOpacity
        className="absolute top-12 right-5 p-2.5 bg-white/20 rounded-full px-5"
        onPress={handleSkip}
      >
        <Text className="text-white font-bold">Skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
