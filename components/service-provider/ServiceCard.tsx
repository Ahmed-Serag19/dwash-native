import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Service } from "@/interfaces/interfaces";

interface ServiceCardProps {
  service: Service;
  onBookService: (service: Service) => void;
}

export default function ServiceCard({
  service,
  onBookService,
}: ServiceCardProps) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.servicesNameAr}</Text>
        <Text style={styles.serviceDescription}>
          {service.servicesDescriptionsAr}
        </Text>
      </View>
      <View style={styles.servicePriceContainer}>
        <Text style={styles.servicePrice}>{service.servicesPrice} ر.س</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBookService(service)}
        >
          <Text style={styles.bookButtonText}>احجز الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  serviceInfo: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "right",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  servicePriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A3981",
  },
  bookButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
