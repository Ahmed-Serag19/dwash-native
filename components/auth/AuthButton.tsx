import type React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface AuthButtonProps {
  onPress: () => void;
  loading: boolean;
  text: string;
  loadingText?: string;
  secondary?: boolean;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  onPress,
  loading,
  text,
  loadingText,
  secondary = false,
  className = "",
}) => {
  return (
    <TouchableOpacity
      className={`w-full h-[50px] ${
        secondary ? "bg-transparent border border-[#0A3981]" : "bg-[#0A3981]"
      } rounded-lg justify-center items-center mt-5 ${
        loading ? "opacity-70" : ""
      } ${className}`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View className="flex-row items-center justify-center gap-2">
          <ActivityIndicator color={secondary ? "#0A3981" : "#fff"} />
          {loadingText && (
            <Text
              className={`${
                secondary ? "text-[#0A3981]" : "text-white"
              } text-lg font-semibold`}
            >
              {loadingText}
            </Text>
          )}
        </View>
      ) : (
        <Text
          className={`${
            secondary ? "text-[#0A3981]" : "text-white"
          } text-lg font-semibold`}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;
