import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useUser } from "@/context/UserContext";
import { router } from "expo-router";
import { Search, MapPin } from "lucide-react-native";
import {
  FreelancersProvider,
  useFreelancers,
} from "@/context/FreelancerContext";
import AdvertisementCarousel from "@/components/home/AdvertisementCarousel";
import ServiceProvidersList from "@/components/home/ServiceProviderList";
import IncompleteProfileModal from "@/components/home/IncompleteProfileModal";
import { images } from "@/constants/images";

function HomeContent() {
  const { user } = useUser();
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchFreelancers } = useFreelancers();
  useEffect(() => {
    if (user) {
      const isIncomplete =
        !user.email?.trim() || !user.nameAr?.trim() || !user.nameEn?.trim();
      setShowIncompleteModal(isIncomplete);
    }
  }, [user]);

  const goToProfile = () => {
    setShowIncompleteModal(false);
    router.push("/main/profile");
  };

  const navigateToServiceProvider = (brandId: number) => {
    router.push({
      pathname: "/main/service-provider/[id]",
      params: { id: brandId.toString() },
    });
  };

  useEffect(() => {
    fetchFreelancers(8);
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View>
        <ImageBackground
          source={images.homeHeader}
          style={{ width: "100%", height: 160, borderRadius: 30 }}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <MapPin size={24} color="#fff" />
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="بحث"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
            <Search size={20} color="#999" style={styles.searchIcon} />
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Advertisements Carousel */}
        <View style={styles.carouselContainer}>
          <AdvertisementCarousel />
        </View>

        {/* Service Providers Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>مزودي الخدمة</Text>
          <ServiceProvidersList
            searchQuery={searchQuery}
            onSelectProvider={navigateToServiceProvider}
          />
        </View>
      </ScrollView>

      {/* Incomplete Profile Modal */}
      <IncompleteProfileModal
        visible={showIncompleteModal}
        onPress={goToProfile}
      />
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <FreelancersProvider>
      <HomeContent />
    </FreelancersProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    // borderRadius: 50,
    // backgroundColor: "#0F0D23",
  },
  logo: {
    width: 80,
    height: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    height: 180,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A3981",
    marginBottom: 16,
    textAlign: "center",
  },
});
