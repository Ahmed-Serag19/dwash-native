import { Tabs } from "expo-router";
import {
  Home,
  CalendarDays,
  Wallet,
  User,
  ShoppingCart,
} from "lucide-react-native";
import CustomTabBar from "@/components/CustomTabBar";

export default function MainLayout() {
  return (
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
          href: null, // This hides it from the tab bar but keeps it in navigation
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "سلة التسوق",
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
          href: null, // This hides it from the tab bar but keeps it in navigation
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide this from the tab bar
        }}
      />
    </Tabs>
  );
}
