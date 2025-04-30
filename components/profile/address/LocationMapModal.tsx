"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { X, Navigation } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Default coordinates for Saudi Arabia (Riyadh)
const SAUDI_DEFAULT_LAT = 24.7136;
const SAUDI_DEFAULT_LNG = 46.6753;

interface LocationMapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (latitude: number, longitude: number) => void;
  initialLatitude?: string;
  initialLongitude?: string;
}

export default function LocationMapModal({
  visible,
  onClose,
  onSelectLocation,
  initialLatitude,
  initialLongitude,
}: LocationMapModalProps) {
  const [region, setRegion] = useState({
    latitude: initialLatitude
      ? Number.parseFloat(initialLatitude)
      : SAUDI_DEFAULT_LAT,
    longitude: initialLongitude
      ? Number.parseFloat(initialLongitude)
      : SAUDI_DEFAULT_LNG,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: initialLatitude
      ? Number.parseFloat(initialLatitude)
      : SAUDI_DEFAULT_LAT,
    longitude: initialLongitude
      ? Number.parseFloat(initialLongitude)
      : SAUDI_DEFAULT_LNG,
  });
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (visible) {
      if (initialLatitude && initialLongitude) {
        const lat = Number.parseFloat(initialLatitude);
        const lng = Number.parseFloat(initialLongitude);
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        setMarkerPosition({
          latitude: lat,
          longitude: lng,
        });
      } else {
        getCurrentLocation();
      }
    }
  }, [visible, initialLatitude, initialLongitude]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        // Fall back to Saudi Arabia default coordinates
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      setMarkerPosition({
        latitude,
        longitude,
      });

      // Animate to the current location
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      // Fall back to Saudi Arabia default coordinates if there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setMarkerPosition(coordinate);
  };

  const handleConfirmLocation = () => {
    onSelectLocation(markerPosition.latitude, markerPosition.longitude);
    onClose();
  };

  const handleInstructions = () => {
    alert(
      "تعليمات:\n\n1. اضغط على أي مكان في الخريطة لتحديد الموقع\n2. يمكنك سحب المؤشر لضبط الموقع بدقة\n3. اضغط على زر 'الموقع الحالي' للانتقال إلى موقعك الحالي\n4. اضغط على 'تأكيد الموقع' عند الانتهاء"
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>تحديد الموقع</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleInstructions}
          >
            <Text style={styles.helpButtonText}>؟</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0A3981" />
              <Text style={styles.loadingText}>جاري تحميل الخريطة...</Text>
            </View>
          ) : (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              onPress={handleMapPress}
              showsUserLocation={true}
            >
              <Marker
                coordinate={markerPosition}
                draggable
                onDragEnd={(e) => setMarkerPosition(e.nativeEvent.coordinate)}
              />
            </MapView>
          )}

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              اضغط على الخريطة لتحديد الموقع أو اسحب المؤشر
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={getCurrentLocation}
            >
              <Navigation size={20} color="#fff" />
              <Text style={styles.buttonText}>الموقع الحالي</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmLocation}
            >
              <Text style={styles.buttonText}>تأكيد الموقع</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A3981",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0A3981",
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0A3981",
  },
  instructionContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
  },
  instructionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currentLocationButton: {
    backgroundColor: "#0A3981",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
