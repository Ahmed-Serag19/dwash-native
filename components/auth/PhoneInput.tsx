import type React from "react";
import { View, Text, Image, TextInput } from "react-native";
import { type Control, Controller } from "react-hook-form";

interface PhoneInputProps {
  control: Control<any>;
  errors: any;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ control, errors }) => {
  const phoneRegex = /^05\d{8}$/;

  return (
    <>
      <Text className="self-end text-base font-semibold mb-2.5 text-black">
        ادخل رقم الجوال
      </Text>
      <View className="flex-row w-full h-[55px] border border-[#656565] rounded-2xl overflow-hidden mb-4">
        <View className="flex-row items-center justify-center bg-[#f9f9f9] px-2.5 border-r border-r-[#ccc] w-[100px]">
          <Image
            source={require("@/assets/images/saudi-flag.png")}
            className="w-[34px] h-[24px] mr-1"
            resizeMode="contain"
          />
          <Text className="text-base font-medium">+966</Text>
        </View>
        <Controller
          control={control}
          rules={{
            required: "رقم الهاتف مطلوب",
            pattern: {
              value: phoneRegex,
              message:
                "رقم الهاتف غير صالح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 px-4 text-base text-left"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="05********"
              keyboardType="phone-pad"
              maxLength={10}
            />
          )}
          name="phoneNumber"
        />
      </View>
      {errors.phoneNumber && (
        <Text className="text-red-500 self-start mb-4">
          {errors.phoneNumber.message}
        </Text>
      )}
    </>
  );
};

export default PhoneInput;
