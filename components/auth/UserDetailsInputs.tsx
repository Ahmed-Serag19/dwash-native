import type React from "react";
import { Text, TextInput } from "react-native";
import { type Control, Controller } from "react-hook-form";

interface UserDetailsInputsProps {
  control: Control<any>;
  errors: any;
}

const UserDetailsInputs: React.FC<UserDetailsInputsProps> = ({
  control,
  errors,
}) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <>
      <Text className="self-end text-base font-semibold mb-2.5 text-black">
        الاسم الكامل
      </Text>
      <Controller
        control={control}
        rules={{
          required: "الاسم الكامل مطلوب",
          minLength: {
            value: 3,
            message: "يجب أن يكون الاسم على الأقل 3 أحرف",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="w-full h-[55px] border border-[#656565] rounded-2xl px-4 text-base mb-4 text-right"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="أدخل الاسم الكامل"
          />
        )}
        name="fullName"
      />
      {errors.fullName && (
        <Text className="text-red-500 self-start mb-4">
          {errors.fullName.message}
        </Text>
      )}

      <Text className="self-end text-base font-semibold mb-2.5 text-black">
        البريد الإلكتروني
      </Text>
      <Controller
        control={control}
        rules={{
          required: "البريد الإلكتروني مطلوب",
          pattern: {
            value: emailRegex,
            message: "البريد الإلكتروني غير صالح",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="w-full h-[55px] border border-[#656565] rounded-2xl px-4 text-base mb-4 text-right"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="أدخل البريد الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text className="text-red-500 self-start mb-4">
          {errors.email.message}
        </Text>
      )}
    </>
  );
};

export default UserDetailsInputs;
