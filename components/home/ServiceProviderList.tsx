import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFreelancers } from "@/context/FreelancerContext";
import ServiceProviderCard from "./ServiceProviderCard";
import { Freelancer } from "@/interfaces/interfaces";

interface ServiceProvidersListProps {
  searchQuery: string;
  onSelectProvider: (brandId: number) => void;
}

export default function ServiceProvidersList({
  searchQuery,
  onSelectProvider,
}: ServiceProvidersListProps) {
  const { freelancers, size, loading, increaseSize } = useFreelancers();

  // Filter freelancers based on search query
  const filteredFreelancers =
    !searchQuery || searchQuery.trim() === ""
      ? freelancers
      : freelancers.filter(
          (freelancer: Freelancer) =>
            freelancer.brandNameEn
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            freelancer.brandNameAr
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

  const handleLoadMore = () => {
    if (!loading && freelancers.length >= size) {
      increaseSize();
    }
  };

  if (loading && freelancers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
      </View>
    );
  }

  if (filteredFreelancers.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          {!searchQuery || searchQuery.trim() === ""
            ? "لا يوجد مزودي خدمة متاحين"
            : "لا توجد نتائج مطابقة للبحث"}
        </Text>
      </View>
    );
  }
  return (
    <View>
      {filteredFreelancers.map((freelancer: Freelancer) => (
        <ServiceProviderCard
          key={freelancer.brandId}
          freelancer={freelancer}
          onPress={onSelectProvider}
        />
      ))}

      {/* Load More Button */}
      {freelancers.length >= size && !loading && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreText}>عرض المزيد</Text>
        </TouchableOpacity>
      )}

      {/* Loading indicator when loading more */}
      {loading && freelancers.length > 0 && (
        <ActivityIndicator
          size="large"
          color="#0A3981"
          style={styles.loadMoreIndicator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadMoreButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#0A3981",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 16,
  },
  loadMoreText: {
    color: "#0A3981",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadMoreIndicator: {
    marginTop: 16,
  },
});
