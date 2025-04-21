// app/main/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  CalendarDays,
  Wallet,
  MoreHorizontal,
} from "lucide-react-native";
import { router } from "expo-router";
import { useUser } from "@/context/UserContext";
import MoreMenuModal from "@/components/MoreMenuModal";

// Screens for each tab
import OrdersScreen from "./orders";
import WalletScreen from "./wallet";
import HomeScreen from "./home";

const Tab = createBottomTabNavigator();

interface RouteType {
  key: string;
  name: string;
}

function MyTabBar({ state, navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useUser();

  const onPressHandler = (route: RouteType) => {
    if (route.name === "More") {
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
        {state.routes.map((route: RouteType, index: number) => {
          const isFocused = state.index === index;
          let icon;

          if (route.name === "Home") {
            icon = <Home size={24} color={isFocused ? "#0A3981" : "black"} />;
          } else if (route.name === "Orders") {
            icon = (
              <CalendarDays size={24} color={isFocused ? "#0A3981" : "black"} />
            );
          } else if (route.name === "Wallet") {
            icon = <Wallet size={24} color={isFocused ? "#0A3981" : "black"} />;
          } else if (route.name === "More") {
            icon = (
              <MoreHorizontal
                size={24}
                color={isFocused ? "#0A3981" : "black"}
              />
            );
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPressHandler(route)}
              style={styles.tabButton}
            >
              {icon}
              {isFocused && <Text style={styles.tabLabel}>{route.name}</Text>}
            </TouchableOpacity>
          );
        })}
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

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="More" children={() => null} />
    </Tab.Navigator>
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
