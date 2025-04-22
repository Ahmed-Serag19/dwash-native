import type React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useUser } from "@/context/UserContext";
import {
  Home,
  CalendarDays,
  Wallet,
  MoreHorizontal,
} from "lucide-react-native";
import MoreMenuModal from "./MoreMenuModal";

interface RouteType {
  key: string;
  name: string;
}

export default function CustomTabBar({ state, navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useUser();

  // Only show these tabs in the tab bar
  const visibleTabs = ["home", "orders", "wallet", "more"];

  const onPressHandler = (route: RouteType, index: number) => {
    if (route.name === "more") {
      setMenuVisible(true);
      return;
    }

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <>
      <View style={styles.tabBarContainer}>
        {/* Home Tab */}
        <TabButton
          isFocused={state.index === 0}
          onPress={() => onPressHandler({ key: "home", name: "home" }, 0)}
          icon={
            <Home size={24} color={state.index === 0 ? "#0A3981" : "black"} />
          }
          label="الرئيسية"
        />

        {/* Orders Tab */}
        <TabButton
          isFocused={state.index === 1}
          onPress={() => onPressHandler({ key: "orders", name: "orders" }, 1)}
          icon={
            <CalendarDays
              size={24}
              color={state.index === 1 ? "#0A3981" : "black"}
            />
          }
          label="طلباتي"
        />

        {/* Wallet Tab */}
        <TabButton
          isFocused={state.index === 2}
          onPress={() => onPressHandler({ key: "wallet", name: "wallet" }, 2)}
          icon={
            <Wallet size={24} color={state.index === 2 ? "#0A3981" : "black"} />
          }
          label="المحفظة"
        />

        {/* More Tab */}
        <TabButton
          isFocused={false}
          onPress={() => setMenuVisible(true)}
          icon={<MoreHorizontal size={24} color="black" />}
          label="المزيد"
        />
      </View>

      <MoreMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigateProfile={() => {
          setMenuVisible(false);
          setTimeout(() => router.push("/main/profile"), 100);
        }}
        onNavigateCart={() => {
          setMenuVisible(false);
          setTimeout(() => router.push("/main/cart"), 100);
        }}
        onLogout={async () => {
          setMenuVisible(false);
          await logout();
          router.replace("/(auth)/Login");
        }}
      />
    </>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ isFocused, onPress, icon, label }: TabButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton}>
      {icon}
      {isFocused && <Text style={styles.tabLabel}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 50,
    marginHorizontal: 20,
    height: 60,
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    color: "#0A3981",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});
