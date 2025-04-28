import { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

interface Color {
  carColorId: number;
  colorAr: string;
  colorEn: string;
}

interface ColorSelectorProps {
  selectedColorId: number;
  onChange: (colorId: number) => void;
}

export default function ColorSelector({
  selectedColorId,
  onChange,
}: ColorSelectorProps) {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);

  // Map color IDs to actual hex values for display
  const colorValueMap: Record<number, string> = {
    3: "#ffffff", // White
    4: "#000000", // Black
    1: "#808080", // Gray
    2: "#c0c0c0", // Silver
    5: "#0000ff", // Blue
    6: "#ff0000", // Red
    7: "#a52a2a", // Brown
    8: "#f5f5dc", // Beige
    9: "#008000", // Green
    10: "#ffa500", // Orange
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCarColor);
        if (response.data.success) {
          setColors(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#0A3981" />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {colors.map((color) => (
        <TouchableOpacity
          key={color.carColorId}
          style={[
            styles.colorButton,
            { backgroundColor: colorValueMap[color.carColorId] || "#ccc" },
            selectedColorId === color.carColorId && styles.selectedColor,
          ]}
          onPress={() => onChange(color.carColorId)}
          activeOpacity={0.7}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 12,
    paddingVertical: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#0A3981",
    transform: [{ scale: 1.1 }],
  },
});
