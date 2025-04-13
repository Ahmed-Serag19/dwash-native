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
    image: images.secondSlide,
  },
  {
    key: "3",
    title: "ابدأ",
    image: images.thirdSlide,
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
              backgroundColor: "#ccc",
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 5,
              bottom: 20,
              paddingHorizontal: 5,
            }}
          />
        }
        activeDot={
          <View
            className="transition-all duration-200"
            style={{
              backgroundColor: "#0a3981",
              width: 15,
              height: 10,
              borderRadius: 7.5,
              marginHorizontal: 5,
              bottom: 20,
            }}
          />
        }
        onIndexChanged={(index: any) => setCurrentIndex(index)}
      >
        {slides.map((slide) => (
          <View
            key={slide.key}
            className="flex-1  justify-center items-center  bg-gray-100"
          >
            <Image
              source={slide.image}
              className={`mb-10 ${currentIndex === 0 ? "ml-16" : ""}`}
              resizeMode="contain"
              style={{
                width: width * 1,
                height: height * 0.7,
                // marginLeft: 40,
              }}
            />
            <Text
              onPress={handleSkip}
              className="text-2xl font-bold mb-10 text-white px-6 py-2 rounded-lg bg-primary  text-center"
            >
              {slide.title}
            </Text>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
}
