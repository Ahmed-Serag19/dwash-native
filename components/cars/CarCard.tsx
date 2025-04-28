import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface CarCardProps {
  car: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  const modelName = car.carModelAr || car.carModelEn;
  const brandName = car.carBrandAr || car.carBrandEn;
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

  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <View style={styles.carInfo}>
          <Text style={styles.carTitle}>
            {brandName} {modelName}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>رقم اللوحة</Text>
              <Text style={styles.detailValue}>{car.carPlateNo}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>اللون</Text>
              <View style={styles.colorContainer}>
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: car.carColorEn.toLowerCase() || "#ccc",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {onEdit && onDelete && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.buttonText}>حذف</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.buttonText}>تعديل</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  cardContent: {
    padding: 16,
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700",
    color: "#0A3981",
    marginBottom: 12,
    textAlign: "right",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    color: "#0A3981",
    marginBottom: 8,
  },
  detailValue: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "#333",
  },
  colorContainer: {
    alignItems: "center",
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  editButton: {
    flex: 1,
    backgroundColor: "rgba(0, 67, 146, 0.8)",
    padding: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "rgba(228, 61, 32, 0.8)",
    padding: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: isSmallScreen ? 14 : 16,
  },
});
