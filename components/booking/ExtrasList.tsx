import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function ExtrasList({
  extras,
}: {
  extras: Array<{ id: number; name: string; price: number }>;
}) {
  if (!extras.length) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>خدمات إضافية</Text>
      {extras.map((e) => (
        <View key={e.id} style={styles.item}>
          <Text>{e.name}</Text>
          <Text>{e.price} ر.س</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});
