import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import StarRating from "./StarRating";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

const OrderCardMobile = ({
  order,
  isClosed,
  onCancel,
  onAddReview,
}: {
  order: any;
  isClosed: boolean;
  onCancel?: () => void;
  onAddReview?: (requestId: number, rating: number, comment: string) => void;
}) => {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    brandNameAr,
    userPhoneNumber,
    fromTime,
    timeTo,
    reservationDate,
    reviewed,
    request,
    itemDto,
    totalAmount,
  } = order;

  const statusMap: any = {
    WAITING: "في الانتظار",
    COMPLETED: "مكتمل",
    COMPLETED_BY_ADMIN: "مكتمل من المشرف",
    CANCELLED: "ملغي",
    CANCELLED_BY_ADMIN: "ملغي من المشرف",
    REJECTED: "مرفوض",
    ACCEPTED: "مقبول",
  };

  const translatedStatus = statusMap[request.statusName] || request.statusName;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{brandNameAr}</Text>

      {userPhoneNumber && (
        <Text style={styles.row}>
          <Text style={styles.label}>رقم الهاتف:</Text> {userPhoneNumber}
        </Text>
      )}

      {!isClosed && fromTime && timeTo && (
        <Text style={styles.row}>
          <Text style={styles.label}>الوقت:</Text> {fromTime} - {timeTo}
        </Text>
      )}

      <Text style={styles.row}>
        <Text style={styles.label}>التاريخ:</Text> {reservationDate}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>الحالة:</Text>{" "}
        <Text
          style={[
            styles.status,
            request.statusName.includes("COMPLETED") ||
            request.statusName === "ACCEPTED"
              ? styles.statusGreen
              : styles.statusRed,
          ]}
        >
          {translatedStatus}
        </Text>
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>الخدمة:</Text> {itemDto.itemNameAr}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>نوع الخدمة:</Text> {itemDto.serviceTypeAr}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>السعر:</Text> {itemDto.itemPrice} ريال
      </Text>

      {itemDto.itemExtraDtos?.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.label}>الإضافات:</Text>
          {itemDto.itemExtraDtos.map((extra: any, i: number) => (
            <Text key={i} style={styles.extra}>
              {extra.itemExtraNameAr} - {extra.itemExtraPrice} ريال
            </Text>
          ))}
        </View>
      )}

      <Text style={[styles.row, { marginTop: 4 }]}>
        <Text style={styles.label}>الإجمالي:</Text> {totalAmount} ريال
      </Text>

      <View style={styles.buttonContainer}>
        {!isClosed && onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.btnText}>إلغاء الطلب</Text>
          </TouchableOpacity>
        )}

        {request.statusName === "COMPLETED" && !reviewed && onAddReview && (
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => setIsReviewModalVisible(true)}
          >
            <Text style={styles.btnText}>إضافة تقييم</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* تقييم */}
      <Modal visible={isReviewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تقييم الخدمة</Text>

            <Text style={styles.label}>عدد النجوم:</Text>
            <StarRating rating={rating} onRatingChange={setRating} />

            <Text style={[styles.label, { marginTop: 12 }]}>ملاحظات:</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              style={styles.textArea}
              placeholder="اكتب رأيك هنا..."
              multiline
              numberOfLines={4}
              textAlign="right"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setIsReviewModalVisible(false)}
              >
                <Text style={styles.btnText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={() => {
                  if (onAddReview) {
                    onAddReview(request.id, rating, comment);
                    setIsReviewModalVisible(false);
                  }

                  setIsReviewModalVisible(false);
                }}
              >
                <Text style={styles.btnText}>إرسال</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderCardMobile;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0A3981",
    textAlign: "right",
  },
  row: {
    marginBottom: 6,
    fontSize: 14,
    textAlign: "right",
  },
  label: {
    fontWeight: "600",
    color: "#0A3981",
  },
  extra: {
    fontSize: 13,
    textAlign: "right",
    color: "#444",
  },
  status: {
    fontWeight: "bold",
  },
  statusGreen: {
    color: "green",
  },
  statusRed: {
    color: "red",
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: "row-reverse",
    gap: 10,
    justifyContent: "flex-start",
  },
  cancelBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reviewBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: width * 0.9,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0A3981",
    textAlign: "center",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginTop: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 10,
  },
  cancelModalBtn: {
    backgroundColor: "#aaa",
    padding: 10,
    borderRadius: 6,
  },
  submitModalBtn: {
    backgroundColor: "#0A3981",
    padding: 10,
    borderRadius: 6,
  },
});
