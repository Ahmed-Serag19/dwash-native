import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useUser } from "@/context/UserContext";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function Index() {
  const { getUser, getCars, getAddresses } = useUser();
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getUser(), getCars(), getAddresses()]);
      } catch (error) {
        console.error("Error preloading user data:", error);
      } finally {
        setLoading(false);
        setRedirect(true);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
        <Text style={styles.loadingText}>جارٍ تحميل البيانات...</Text>
      </View>
    );
  }

  if (redirect) {
    return <Redirect href="/main/home" />;
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#0A3981",
  },
});
