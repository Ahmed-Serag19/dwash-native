import type React from "react";
import { useRef, useEffect } from "react";
import { View, TextInput } from "react-native";

interface OTPDigitInputProps {
  value: string[];
  onChange: (value: string, index: number) => void;
  onKeyPress: (e: any, index: number) => void;
}

const OTPDigitInput: React.FC<OTPDigitInputProps> = ({
  value,
  onChange,
  onKeyPress,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  return (
    <View className="flex-row justify-between w-full mb-10">
      {value.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="w-[45px] h-[45px] border border-[#656565] rounded-lg text-center text-lg font-semibold"
          value={digit}
          onChangeText={(text) => onChange(text, index)}
          onKeyPress={(e) => onKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default OTPDigitInput;
