import { Tabs } from "expo-router";
import {
  Home,
  CalendarDays,
  Wallet,
  User,
  ShoppingCart,
} from "lucide-react-native";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "@/components/CustomTabBar";

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === "android" ? insets.top : 0 }} />

      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "الرئيسية",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "طلباتي",
            tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "المحفظة",
            tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "الملف الشخصي",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "سلة التسوق",
            tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
            href: null,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
