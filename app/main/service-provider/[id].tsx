import React, { useRef, useState } from "react";
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
import { images } from "@/constants/images";

I18nManager.forceRTL(true);

const { width: screenWidth } = Dimensions.get("window");
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";

interface Review {
  username: string;
  description: string;
  appraisal: number;
}

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
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <View style={styles.bannerContainer}>
          <Image
            source={
              freelancer.brandLogo
                ? { uri: `${baseImageUrl}${freelancer.brandLogo}` }
                : images.defaultServiceProviderImage
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

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>الوصف</Text>
          <Text style={styles.descriptionText}>
            {freelancer.brandDescriptionsAr || "لا يوجد وصف متاح"}
          </Text>
        </View>

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

        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>آراء العملاء</Text>
          {loadingReviews ? (
            <ActivityIndicator size="small" color="#0A3981" />
          ) : reviews.length === 0 ? (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>لا توجد تقييمات بعد</Text>
            </View>
          ) : (
            <View style={styles.carouselContainer}>
              <Swiper
                ref={swiperRef}
                autoplay
                autoplayTimeout={5}
                loop
                showsPagination={false}
                height={220}
                onIndexChanged={(index) => setCurrentIndex(index)}
              >
                {reviews.map((rev: Review, idx: number) => (
                  <View key={idx} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Image
                        source={images.defaultReviewAvatar}
                        style={styles.reviewAvatar}
                        resizeMode="cover"
                      />
                      <View style={styles.reviewUserInfo}>
                        <Text style={styles.reviewUsername}>
                          {rev.username}
                        </Text>
                        <Text style={styles.reviewDate}>منذ شهر</Text>
                      </View>
                      <View style={styles.reviewRating}>
                        <Star size={20} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.reviewRatingText}>
                          {rev.appraisal.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewBody}>
                      <Text style={styles.reviewDescription} numberOfLines={4}>
                        {rev.description || "تقييم عام جيد"}
                      </Text>
                    </View>
                    <View style={styles.reviewFooter}>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={18}
                            color={n <= rev.appraisal ? "#FFD700" : "#E0E0E0"}
                            fill={n <= rev.appraisal ? "#FFD700" : "none"}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </Swiper>
              <View style={styles.customPagination}>
                {reviews.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
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
    marginBottom: 70,
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
    marginBottom: 24,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 20,
    textAlign: "right",
  },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyReviewsImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.6,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  carouselContainer: {
    height: 250,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    height: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0A3981",
  },
  reviewUserInfo: {
    flex: 1,
    marginRight: 12,
    alignItems: "flex-end",
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  reviewBody: {
    flex: 1,
    marginBottom: 12,
  },
  reviewDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    textAlign: "right",
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  reviewStars: {
    flexDirection: "row",
  },
  customPagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: "#0A3981",
  },
});
