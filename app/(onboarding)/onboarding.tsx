import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import { images } from "@/constants/images";

const OnboardingScreen = () => {
  const router = useRouter();
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  // Handle screen dimension changes for better responsiveness
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

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

  const handleSkip = () => {
    if (currentIndex === slides.length - 1) {
      // If on last slide, go to login
      router.replace("/(auth)/Login");
    } else {
      // If not on last slide, skip to last slide
      swiperRef.current?.scrollTo(slides.length - 1, true);
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View
            style={[
              styles.dot,
              {
                backgroundColor: "#ccc",
                width: 10,
                height: 10,
              },
            ]}
          />
        }
        activeDot={
          <View
            style={[
              styles.dot,
              {
                backgroundColor: "#0a3981",
                width: 15,
                height: 10,
              },
            ]}
          />
        }
        onIndexChanged={(index) => setCurrentIndex(index)}
        paginationStyle={[
          styles.pagination,
          { bottom: screenDimensions.height < 700 ? 30 : 50 },
        ]}
      >
        {slides.map((slide, index) => (
          <View key={slide.key} style={styles.slide}>
            <Image
              source={slide.image}
              style={[
                styles.image,
                {
                  width: screenDimensions.width,
                  height:
                    screenDimensions.height *
                    (screenDimensions.height < 700 ? 0.6 : 0.7),
                },
                index === 0 && styles.firstSlideImage,
              ]}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={handleSkip}
              style={[styles.button, isLastSlide && styles.buttonActive]}
            >
              <Text style={styles.buttonText}>{slide.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? -20 : 0,
    marginBottom: 10,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    marginBottom: 20,
  },
  firstSlideImage: {
    marginLeft: 30,
  },
  button: {
    backgroundColor: "#0a3981",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: 120,
  },
  buttonActive: {
    backgroundColor: "#0a3981",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  dot: {
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pagination: {
    bottom: 50,
  },
});

export default OnboardingScreen;
