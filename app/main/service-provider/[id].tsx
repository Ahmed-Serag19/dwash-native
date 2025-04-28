import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { Freelancer, Service } from "@/interfaces/interfaces";
import { Star, ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/context/UserContext";
import ServiceAccordion from "@/components/service-provider/ServiceAccordion";

// Base URL for images
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";
// Default placeholder image for service providers
const defaultServiceProviderImage = require("@/assets/images/service-providers.jpg");

export default function ServiceProviderScreen() {
  const { id } = useLocalSearchParams();
  const brandId = typeof id === "string" ? Number.parseInt(id) : 0;
  const { user } = useUser();

  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceProvider = async () => {
      try {
        // Fetch freelancer details
        const freelancersResponse = await axios.get(
          apiEndpoints.getFreelancers(100)
        );
        if (freelancersResponse.data.success) {
          const freelancerData = freelancersResponse.data.content?.data.find(
            (f: Freelancer) => f.brandId === brandId
          );
          if (freelancerData) {
            setFreelancer(freelancerData);
          }
        }

        // Fetch services for this brand using the corrected endpoint
        const servicesResponse = await axios.get(
          apiEndpoints.getServicesByBrandId(brandId)
        );
        if (servicesResponse.data.success) {
          setServices(servicesResponse.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching service provider data:", error);
        Toast.show({
          type: "error",
          text1: "حدث خطأ أثناء تحميل البيانات",
        });
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchServiceProvider();
    }
  }, [brandId]);

  const handleAddToCart = async (
    serviceId: number,
    extraServices: number[]
  ) => {
    if (!user) {
      Toast.show({
        type: "info",
        text1: "يجب تسجيل الدخول أولاً",
      });
      router.push("/(auth)/Login");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      const response = await axios.post(
        apiEndpoints.addToCart,
        {
          serviceId: serviceId,
          extraServices: extraServices,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "تمت الإضافة إلى السلة بنجاح",
        });
      }
    } catch (error) {
      console.log("Full error:", error);

      if (axios.isAxiosError(error)) {
        // Check the error response structure
        const errorMessage =
          error.response?.data?.messageEn || error.response?.data?.message;

        if (
          errorMessage &&
          errorMessage.toLowerCase().includes("already exist")
        ) {
          Toast.show({
            type: "error",
            text1: "الخدمة موجودة بالفعل في السلة",
          });
          return;
        }

        // Handle other API errors
        const errorText =
          error.response?.data?.messageAr ||
          "حدث خطأ أثناء إضافة الخدمة إلى السلة";
        Toast.show({
          type: "error",
          text1: errorText,
        });
        return;
      }

      // Handle non-API errors
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ غير متوقع أثناء إضافة الخدمة إلى السلة",
      });
    }
  };
  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
      </SafeAreaView>
    );
  }

  if (!freelancer) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>لم يتم العثور على مزود الخدمة</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>العودة</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#0A3981" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{freelancer.brandNameAr}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Service Provider Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={
              freelancer.brandLogo
                ? { uri: `${baseImageUrl}${freelancer.brandLogo}` }
                : defaultServiceProviderImage
            }
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{freelancer.brandNameAr}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                {freelancer.avgAppraisal.toFixed(1)}
              </Text>
              <Star size={18} color="#fdca01" fill="#fdca01" />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>الوصف</Text>
          <Text style={styles.descriptionText}>
            {freelancer.brandDescriptionsAr || "لا يوجد وصف متاح"}
          </Text>
        </View>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>الخدمات المتاحة</Text>

          {services.length > 0 ? (
            services.map((service) => (
              <ServiceAccordion
                key={service.serviceId}
                service={service}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <View style={styles.noServicesContainer}>
              <Text style={styles.noServicesText}>لا توجد خدمات متاحة</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#0A3981",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    position: "relative",
    height: 200,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 4,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 8,
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "right",
  },
  servicesContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 16,
    textAlign: "right",
  },
  noServicesContainer: {
    padding: 20,
    alignItems: "center",
  },
  noServicesText: {
    fontSize: 16,
    color: "#666",
  },
});
