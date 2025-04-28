import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Star } from "lucide-react-native";
import type { Freelancer } from "@/interfaces/interfaces";

// Base URL for images
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";
// Default placeholder image for service providers
const defaultServiceProviderImage = require("@/assets/images/service-providers.logo.png");

interface ServiceProviderCardProps {
  freelancer: Freelancer;
  onPress: (brandId: number) => void;
}

export default function ServiceProviderCard({
  freelancer,
  onPress,
}: ServiceProviderCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(freelancer.brandId)}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {freelancer.brandNameAr} - {freelancer.brandNameEn}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {freelancer.brandDescriptionsAr || "وصف"}
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color={
                  star <= Math.round(freelancer.avgAppraisal)
                    ? "#fdca01"
                    : "#bfbdbd"
                }
                fill={
                  star <= Math.round(freelancer.avgAppraisal)
                    ? "#fdca01"
                    : "#bfbdbd"
                }
              />
            ))}
          </View>
        </View>
        <Image
          source={
            freelancer.brandLogo
              ? { uri: `${baseImageUrl}${freelancer.brandLogo}` }
              : defaultServiceProviderImage
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f2f2",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "right",
  },
  starsContainer: {
    flexDirection: "row",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
