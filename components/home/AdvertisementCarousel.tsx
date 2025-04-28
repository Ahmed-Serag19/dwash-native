import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  I18nManager,
} from "react-native";
import Swiper from "react-native-swiper";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { Advertisement } from "@/interfaces/interfaces";
import { AntDesign } from "@expo/vector-icons";

// Force RTL layout
I18nManager.forceRTL(true);

// Base URL for images
const baseImageUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";
const { width: screenWidth } = Dimensions.get("window");

// Default placeholder image for advertisements
const defaultAdImage = require("@/assets/images/service-providers.jpg");

export default function AdvertisementCarousel() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const swiperRef = useRef(null);

  // Fetch advertisements
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(apiEndpoints.getAdvertisements);
        if (response.data.success) {
          setAdvertisements(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const handleAdPress = (ad: Advertisement) => {
    setSelectedAd(ad);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAd(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A3981" />
      </View>
    );
  }

  if (advertisements.length === 0) {
    return (
      <View style={styles.noAdsContainer}>
        <Text style={styles.noAdsText}>لا توجد إعلانات متاحة</Text>
      </View>
    );
  }

  return (
    <>
      <Swiper
        ref={swiperRef}
        autoplay={true}
        autoplayTimeout={5}
        loop={true}
        showsPagination={false}
        height={180}
      >
        {advertisements.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.adSlide}
            activeOpacity={0.8}
            onPress={() => handleAdPress(item)}
          >
            {item.advertisementImages && item.advertisementImages.length > 0 ? (
              <Image
                source={{
                  uri: `${baseImageUrl}${item.advertisementImages[0].imagePath}`,
                }}
                style={styles.adImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={defaultAdImage}
                style={styles.adImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.adOverlay}>
              <Text style={styles.adTitle}>{item.advertisementTitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Swiper>

      {/* Ad Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close button - positioned top left for RTL */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <AntDesign name="close" size={24} color="#0A3981" />
            </TouchableOpacity>

            {selectedAd && (
              <>
                {/* Image Gallery */}
                {selectedAd.advertisementImages &&
                selectedAd.advertisementImages.length > 0 ? (
                  <View style={styles.imageGalleryContainer}>
                    <Swiper
                      showsPagination={true}
                      dot={<View style={styles.modalDot} />}
                      activeDot={<View style={styles.modalActiveDot} />}
                      paginationStyle={styles.modalPagination}
                      height={250}
                    >
                      {selectedAd.advertisementImages.map((image, idx) => (
                        <View key={idx} style={styles.modalImageContainer}>
                          <Image
                            source={{
                              uri: `${baseImageUrl}${image.imagePath}`,
                            }}
                            style={styles.modalImage}
                            resizeMode="contain"
                          />
                        </View>
                      ))}
                    </Swiper>
                  </View>
                ) : (
                  <View style={styles.noImageContainer}>
                    <Image
                      source={defaultAdImage}
                      style={styles.defaultModalImage}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Ad Details */}
                <ScrollView
                  style={styles.detailsContainer}
                  contentContainerStyle={styles.detailsContent}
                >
                  <Text style={styles.modalTitle}>
                    {selectedAd.advertisementTitle}
                  </Text>

                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>
                      {new Date(
                        selectedAd.advertisementStartDate
                      ).toLocaleDateString("ar-SA")}
                    </Text>
                    <Text style={styles.dateLabel}>من:</Text>
                  </View>

                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>
                      {new Date(
                        selectedAd.advertisementEndDate
                      ).toLocaleDateString("ar-SA")}
                    </Text>
                    <Text style={styles.dateLabel}>إلى:</Text>
                  </View>

                  <Text style={styles.descriptionTitle}>تفاصيل العرض:</Text>
                  <Text style={styles.descriptionText}>
                    {selectedAd.advertisementDescription}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  noAdsContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
  },
  noAdsText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "ScheherazadeNew-Regular", // Arabic font
    textAlign: "right",
  },
  adSlide: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    direction: "rtl",
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  adOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
  },
  adTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    fontFamily: "ScheherazadeNew-Bold", // Arabic bold font
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: "80%",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10, // Changed to right for RTL
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  imageGalleryContainer: {
    height: 250,
  },
  modalImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  defaultModalImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailsContent: {
    paddingBottom: 20,
    direction: "rtl",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A3981",
    // textAlign: "right",
    marginBottom: 15,
    fontFamily: "ScheherazadeNew-Bold",
  },
  dateRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    marginBottom: 10,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    fontFamily: "ScheherazadeNew-Regular",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "ScheherazadeNew-Regular",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
    // textAlign: "right",
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "ScheherazadeNew-Bold",
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    // textAlign: "right",
    lineHeight: 24,
    fontFamily: "ScheherazadeNew-Regular",
  },
  modalDot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  modalActiveDot: {
    backgroundColor: "#0A3981",
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  modalPagination: {
    bottom: 10,
  },
});
