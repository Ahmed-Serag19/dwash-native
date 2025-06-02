import React, { useRef } from "react";
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
  Dimensions,
  I18nManager,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Star, ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import ServiceAccordion from "@/components/service-provider/ServiceAccordion";
import Swiper from "react-native-swiper";

import { useProvider } from "@/hooks/useProvider";
import { useServices } from "@/hooks/useServices";
import { useReviews } from "@/hooks/useReviews";
import { addToCart } from "@/services/cartService";

// Force RTL layout for Arabic
I18nManager.forceRTL(true);

const { width: screenWidth } = Dimensions.get("window");
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";
const defaultServiceProviderImage = require("@/assets/images/service-providers.jpg");
const defaultReviewAvatar = require("@/assets/images/dummy-user.avif");

export default function ServiceProviderScreen() {
  const { id } = useLocalSearchParams();
  const brandId = typeof id === "string" ? Number.parseInt(id, 10) : 0;
  const { user } = useUser();

  const {
    freelancer,
    loading: loadingProvider,
    error: providerError,
  } = useProvider(brandId);
  const { services, loading: loadingServices } = useServices(brandId);
  const { reviews, loading: loadingReviews } = useReviews(brandId);

  const swiperRef = useRef<Swiper>(null);

  const goBack = () => {
    router.back();
  };

  const handleAddToCart = async (
    serviceId: number,
    extraServices: number[]
  ) => {
    if (!user) {
      Toast.show({ type: "info", text1: "يجب تسجيل الدخول أولاً" });
      router.push("/(auth)/Login");
      return;
    }
    await addToCart({ serviceId, extraServices });
  };

  if (loadingProvider) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
      </SafeAreaView>
    );
  }

  if (providerError || !freelancer) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {providerError || "لم يتم العثور على مزود الخدمة"}
        </Text>
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
        translucent
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
        {/* Banner */}
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
          {loadingServices ? (
            <ActivityIndicator size="small" color="#0A3981" />
          ) : services.length > 0 ? (
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

        {/* Reviews Carousel */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>التقييمات</Text>
          {loadingReviews ? (
            <ActivityIndicator size="small" color="#0A3981" />
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>لا توجد تقييمات بعد</Text>
          ) : (
            <View style={styles.swiperWrapper}>
              <Swiper
                ref={swiperRef}
                autoplay
                autoplayTimeout={4}
                loop
                showsPagination
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                height={180}
              >
                {reviews.map((rev, idx) => (
                  <View key={idx} style={styles.reviewSlide}>
                    <Image
                      source={defaultReviewAvatar}
                      style={styles.reviewAvatar}
                      resizeMode="cover"
                    />
                    <Text style={styles.reviewUsername}>{rev.username}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={18}
                          color={n <= rev.appraisal ? "#FFD700" : "#BFBDBD"}
                          fill={n <= rev.appraisal ? "#FFD700" : "none"}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewDescription} numberOfLines={2}>
                      {rev.description}
                    </Text>
                  </View>
                ))}
              </Swiper>
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
    marginBottom: 24,
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
  reviewsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 16,
    textAlign: "right",
  },
  noReviewsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },
  swiperWrapper: {
    height: 180,
  },
  reviewSlide: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-end",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    textAlign: "right",
  },
  reviewStars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewDescription: {
    fontSize: 14,
    color: "#444",
    textAlign: "right",
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#0A3981",
    width: 16,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
