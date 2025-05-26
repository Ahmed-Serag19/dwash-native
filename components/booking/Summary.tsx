import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Summary({
  subtotal,
  discount,
  total,
  discountLabel,
}: {
  subtotal: number;
  discount: number;
  total: number;
  discountLabel?: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>المجموع الفرعي</Text>
        <Text>{subtotal.toFixed(2)} ر.س</Text>
      </View>
      <View style={styles.row}>
        <Text>{discountLabel || "الخصم"}</Text>
        <Text>-{discount.toFixed(2)} ر.س</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text>الإجمالي</Text>
        <Text>{total.toFixed(2)} ر.س</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 8,
  },
});
