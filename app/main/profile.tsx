"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useUser } from "@/context/UserContext";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import AddressManagement from "@/components/profile/AddressManagement";
import CarManagement from "@/components/profile/CarManagement";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import Toast from "react-native-toast-message";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

export default function ProfileScreen() {
  const { user, cars, addresses, getUser, getCars, getAddresses } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getUser(), getCars(), getAddresses()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحديث البيانات",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return <LoadingIndicator message="جاري تحميل الملف الشخصي..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ImageBackground
            source={images.headerBg}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            resizeMode="contain"
          >
            <Text style={styles.headerTitle}>الملف الشخصي</Text>
          </ImageBackground>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
          <PersonalInfoForm user={user} onSuccess={getUser} />
        </View>

        {/* Addresses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المواقع المحفوظة</Text>
          <AddressManagement addresses={addresses} onSuccess={getAddresses} />
        </View>

        {/* Cars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>سياراتي</Text>
          <CarManagement cars={cars} onSuccess={getCars} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    position: "relative",
    height: 120,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 22 : 24,
    position: "absolute",
    bottom: 10,
    right: 10,
    fontWeight: "700",
    color: "#0A3981",
    textAlign: "right",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    color: "#0A3981",
    marginBottom: 16,
    textAlign: "right",
  },
});
