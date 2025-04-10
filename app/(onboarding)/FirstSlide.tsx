import { View, Image, Dimensions } from "react-native";
import { images } from "@/constants/images";

const { width, height } = Dimensions.get("window");

const FirstSlide = () => {
  return (
    <View className="flex-1 items-center justify-center px-4 ">
      {/* Image container */}
      <View className="w-full justify-center items-center h-full  ">
        <Image
          source={images.firstSlide}
          style={{
            width: width * 0.9,
            height: height * 1,
            marginLeft: 30,
          }}
          resizeMode="contain"
          className="mb-8"
        />
      </View>
    </View>
  );
};

export default FirstSlide;
