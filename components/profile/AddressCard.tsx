import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

interface AddressCardProps {
  address: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const [formattedAddress, setFormattedAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get formatted address from coordinates
    const getAddressFromCoordinates = async () => {
      if (!address.latitude || !address.longitude) {
        setFormattedAddress("عنوان غير متوفر");
        setLoading(false);
        return;
      }

      try {
        const result = await Location.reverseGeocodeAsync({
          latitude: Number.parseFloat(address.latitude),
          longitude: Number.parseFloat(address.longitude),
        });

        if (result && result.length > 0) {
          const location = result[0];
          // Format the address based on available fields
          const addressParts = [];

          if (location.street) addressParts.push(location.street);
          if (location.district) addressParts.push(location.district);
          if (location.city) addressParts.push(location.city);
          if (location.region) addressParts.push(location.region);

          // If we have address components, join them
          if (addressParts.length > 0) {
            setFormattedAddress(addressParts.join("، "));
          } else {
            // Fallback to showing district and city from our data
            const parts = [];
            if (address.districtNameAr || address.districtAr)
              parts.push(address.districtNameAr || address.districtAr);
            if (address.cityNameAr || address.cityAr)
              parts.push(address.cityNameAr || address.cityAr);
            setFormattedAddress(parts.join("، "));
          }
        } else {
          // Fallback to showing district and city from our data
          const parts = [];
          if (address.districtNameAr || address.districtAr)
            parts.push(address.districtNameAr || address.districtAr);
          if (address.cityNameAr || address.cityAr)
            parts.push(address.cityNameAr || address.cityAr);
          setFormattedAddress(parts.join("، "));
        }
      } catch (error) {
        console.error("Error getting address:", error);
        // Fallback to showing district and city from our data
        const parts = [];
        if (address.districtNameAr || address.districtAr)
          parts.push(address.districtNameAr || address.districtAr);
        if (address.cityNameAr || address.cityAr)
          parts.push(address.cityNameAr || address.cityAr);
        setFormattedAddress(parts.join("، "));
      } finally {
        setLoading(false);
      }
    };

    getAddressFromCoordinates();
  }, [address]);

  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <View style={styles.addressContainer}>
          <Text style={styles.title}>{address.addressTitle}</Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#0A3981"
              style={styles.loader}
            />
          ) : (
            <>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{address.cityAr}</Text>
                <Text style={styles.detailValue}>{address.districtAr},</Text>
              </View>
              <Text style={styles.addressText}>{formattedAddress}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>حذف</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>تعديل</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  addressContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "700",
    color: "#0A3981",
    marginBottom: 4,
    textAlign: "right",
  },
  addressText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "#666",
    textAlign: "right",
  },
  loader: {
    marginTop: 4,
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
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: isSmallScreen ? 12 : 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "rgba(228, 61, 32, 0.8)",
    padding: 8,
    alignItems: "center",
  },
  detailItem: {
    flex: 1,
    alignItems: "flex-end",
    gap: 8,
    flexDirection: "row",
  },
  detailValue: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "black",
    fontWeight: "600",
  },
});
