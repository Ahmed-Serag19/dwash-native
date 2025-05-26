import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export function ProviderInfo({ logo, name }: { logo?: string; name: string }) {
  return (
    <View style={styles.container}>
      <Image
        source={
          logo
            ? { uri: logo }
            : require("@/assets/images/service-providers.jpg")
        }
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  logo: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
