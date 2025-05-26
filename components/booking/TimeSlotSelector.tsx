import React, { useState, useEffect, useRef } from "react";
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

/**
 * Call the lockSlot endpoint to temporarily reserve a slot
 */
async function lockSlot(slotId: number) {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("AUTH_REQUIRED");
  const response = await axios.put(
    `${apiEndpoints.lockSlot}?slotId=${slotId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
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
  const [locking, setLocking] = useState(false);
  const [lockedSlotId, setLockedSlotId] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchTimeSlots();
  }, [brandId]);

  const fetchTimeSlots = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({ type: "error", text1: "يجب تسجيل الدخول أولاً" });
        return;
      }
      const resp = await axios.get(
        `${apiEndpoints.getSlots}?brandId=${brandId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.data.success) {
        const slotsData: TimeSlot[] = resp.data.content || [];
        setSlots(slotsData);

        // group by date
        const grouped = slotsData.reduce((acc, slot) => {
          if (!acc[slot.date]) acc[slot.date] = [];
          acc[slot.date].push(slot);
          return acc;
        }, {} as Record<string, TimeSlot[]>);
        setGroupedSlots(grouped);

        const dates = Object.keys(grouped);
        if (dates.length) setSelectedDate(dates[0]);
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "حدث خطأ أثناء تحميل المواعيد المتاحة",
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert to Arabic date names
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
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
    const dayNames = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return {
      day,
      month: monthNames[d.getMonth()],
      dayName: dayNames[d.getDay()],
    };
  };

  // 12-hour format
  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    let hour = parseInt(h, 10);
    const minute = m;
    const ampm = hour >= 12 ? "م" : "ص"; // Arabic AM/PM
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleLock = async () => {
    if (!selectedSlotId) {
      Toast.show({ type: "error", text1: "الرجاء اختيار موعد أولاً" });
      return;
    }
    setLocking(true);
    try {
      const res = await lockSlot(selectedSlotId);
      if (res.success) {
        Toast.show({
          type: "success",
          text1: res.messageAr || "تم حجز الموعد مؤقتاً",
        });
        setLockedSlotId(selectedSlotId);
      } else {
        Toast.show({ type: "error", text1: res.messageAr || "فشل حجز الموعد" });
      }
    } catch (err) {
      console.error("Error locking slot:", err);
      Toast.show({ type: "error", text1: "حدث خطأ أثناء قفل الموعد" });
    } finally {
      setLocking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0A3981" />
      </View>
    );
  }
  if (!Object.keys(groupedSlots).length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>لا توجد مواعيد متاحة</Text>
      </View>
    );
  }

  const dates = Object.keys(groupedSlots);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>التاريخ</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}
      >
        {dates.map((date, idx) => {
          const { day, month, dayName } = formatDate(date);
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
                  selectedDate === date && styles.selectedText,
                ]}
              >
                {idx === 0 ? "اليوم" : dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  selectedDate === date && styles.selectedText,
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.monthName,
                  selectedDate === date && styles.selectedText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedDate && (
        <>
          <Text style={styles.title}>الوقت</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeScrollContent}
          >
            {groupedSlots[selectedDate].map((slot) => {
              const isThisLocked = slot.slotId === lockedSlotId;
              return (
                <View
                  key={slot.slotId}
                  style={{ alignItems: "center", marginRight: 12 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.timeCard,
                      selectedSlotId === slot.slotId && styles.selectedTimeCard,
                    ]}
                    onPress={() => onSelectSlot(slot.slotId)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        selectedSlotId === slot.slotId && styles.selectedText,
                      ]}
                    >
                      {formatTime(slot.timeFrom)} - {formatTime(slot.timeTo)}
                    </Text>
                  </TouchableOpacity>

                  {/* Lock Button per slot */}
                  {selectedSlotId === slot.slotId && (
                    <TouchableOpacity
                      style={[
                        styles.lockButton,
                        (locking || isThisLocked) && styles.disabledButton,
                      ]}
                      onPress={handleLock}
                      disabled={locking || isThisLocked}
                    >
                      {locking ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.lockButtonText}>
                          {isThisLocked ? "محجوز" : "تأكيد حجز الوقت"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
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
  emptyText: { color: "#666" },
  dateScrollContent: { paddingBottom: 8 },
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
  selectedDateCard: { backgroundColor: "#0A3981" },
  dayName: { fontSize: 12, color: "#333", marginBottom: 4 },
  dayNumber: { fontSize: 18, fontWeight: "bold", color: "#333" },
  monthName: { fontSize: 12, color: "#666" },
  selectedText: { color: "white" },
  timeScrollContent: { paddingBottom: 8, flexDirection: "row" },
  timeCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedTimeCard: { backgroundColor: "#0A3981" },
  timeText: { fontSize: 14, color: "#333" },
  lockButton: {
    marginTop: 6,
    backgroundColor: "#0A3981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  lockButtonText: { color: "white", fontSize: 14 },
  disabledButton: { backgroundColor: "#888" },
});
