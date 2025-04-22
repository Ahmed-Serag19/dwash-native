import type React from "react";
import type { ReactNode } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { images } from "@/constants/images";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-[#f5f5f5]"
      >
        <ImageBackground
          source={images.authBg}
          className="flex-1 justify-center h-[45%]"
          resizeMode="cover"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
              paddingHorizontal: isSmallScreen ? 15 : 20,
            }}
          >
            <View
              className="items-center"
              style={{ marginBottom: isSmallScreen ? 30 : 60 }}
            >
              <Image
                source={images.darkLogo}
                style={{ width: isSmallScreen ? 120 : 140 }}
                className="h-[60px]"
                resizeMode="contain"
              />
              <Text
                className="font-semibold text-[#1a237e]"
                style={{ fontSize: isSmallScreen ? 20 : 24 }}
              >
                D. Wash
              </Text>
            </View>

            {children}
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
