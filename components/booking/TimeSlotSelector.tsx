import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface TimeSlot {
  slotId: number;
  date: string;
  timeFrom: string;
  timeTo: string;
}

interface TimeSlotSelectorProps {
  brandId: number;
  selectedSlotId: number | null;
  onSelectSlot: (slotId: number) => void;
}

export default function TimeSlotSelector({
  brandId,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotSelectorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedSlots, setGroupedSlots] = useState<Record<string, TimeSlot[]>>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchTimeSlots();
  }, [brandId]);

  const fetchTimeSlots = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      const response = await axios.get(
        `${apiEndpoints.getSlots}?brandId=${brandId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const slotsData = response.data.content || [];
        setSlots(slotsData);

        // Group slots by date
        const grouped = slotsData.reduce(
          (acc: Record<string, TimeSlot[]>, slot: TimeSlot) => {
            if (!acc[slot.date]) {
              acc[slot.date] = [];
            }
            acc[slot.date].push(slot);
            return acc;
          },
          {}
        );

        setGroupedSlots(grouped);

        // Set first date as selected if there are dates
        const dates = Object.keys(grouped);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل المواعيد المتاحة",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();

    // Get month name in Arabic
    const monthNames = [
      "يناير",
      "فبراير",
      "مارس",
      "إبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const month = monthNames[date.getMonth()];

    // Get day name in Arabic
    const dayNames = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const dayName = dayNames[date.getDay()];

    return { day, month, dayName };
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0A3981" />
      </View>
    );
  }

  if (Object.keys(groupedSlots).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>لا توجد مواعيد متاحة</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Date Selector */}
      <Text style={styles.title}>التاريخ</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}
      >
        {Object.keys(groupedSlots).map((date, index) => {
          const { day, month, dayName } = formatDate(date);
          const isToday = index === 0; // Assuming first date is today

          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateCard,
                selectedDate === date && styles.selectedDateCard,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dayName,
                  selectedDate === date && styles.selectedDateText,
                ]}
              >
                {isToday ? "اليوم" : dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  selectedDate === date && styles.selectedDateText,
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.monthName,
                  selectedDate === date && styles.selectedDateText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Selector */}
      {selectedDate && (
        <>
          <Text style={styles.title}>الوقت</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeScrollContent}
          >
            {groupedSlots[selectedDate].map((slot) => (
              <TouchableOpacity
                key={slot.slotId}
                style={[
                  styles.timeCard,
                  selectedSlotId === slot.slotId && styles.selectedTimeCard,
                ]}
                onPress={() => onSelectSlot(slot.slotId)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedSlotId === slot.slotId && styles.selectedTimeText,
                  ]}
                >
                  {formatTime(slot.timeFrom)} - {formatTime(slot.timeTo)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
  dateScrollContent: {
    paddingBottom: 8,
  },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  selectedDateCard: {
    backgroundColor: "#0A3981",
  },
  dayName: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthName: {
    fontSize: 12,
    color: "#666",
  },
  selectedDateText: {
    color: "white",
  },
  timeScrollContent: {
    paddingBottom: 8,
  },
  timeCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTimeCard: {
    backgroundColor: "#0A3981",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTimeText: {
    color: "white",
  },
});
