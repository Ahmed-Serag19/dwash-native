import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useUser } from "@/context/UserContext";

export default function Profile() {
  const { user, loading, getUser } = useUser();

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <ActivityIndicator size="large" color="#0A3981" />
        <Text className="mt-2.5 text-base text-[#0A3981]">
          جاري تحميل البيانات...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <Text className="text-lg text-red-500">
          لم يتم العثور على بيانات المستخدم
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 bg-[#f5f5f5]">
      <Text className="text-2xl font-bold mb-5 text-[#0A3981] text-center">
        الملف الشخصي
      </Text>

      <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
        <Text className="text-base font-bold mb-1 text-[#333]">الاسم:</Text>
        <Text className="text-base text-[#666]">
          {user.nameEn || "غير محدد"}
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
        <Text className="text-base font-bold mb-1 text-[#333]">
          البريد الإلكتروني:
        </Text>
        <Text className="text-base text-[#666]">
          {user.email || "غير محدد"}
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
        <Text className="text-base font-bold mb-1 text-[#333]">
          رقم الهاتف:
        </Text>
        <Text className="text-base text-[#666]">
          {user.mobile || "غير محدد"}
        </Text>
      </View>
    </View>
  );
}
