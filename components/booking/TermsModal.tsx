// src/components/booking/TermsModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export interface TermsModalProps {
  visible: boolean;
  onAgree: () => void;
  onClose: () => void;
}

const texts = {
  title: "الشروط والأحكام - دي واش",
  rules: [
    "تقع مسؤولية إزالة وإعادة الملحقات الإضافية في السيارة مثل مقاعد الأطفال والكاميرات والستائر وغيرها من الملحقات على العميل.",
    "لا تتحمل دي واش أي مسؤولية تجاه فقدان أو تلف الممتلكات الخاصة بالعميل والتي لم يتم إزالتها مسبقاً أو تقديم أي تعويض للعميل.",
    "دي واش لا تتحمل الأضرار غير الناتجة من الغسلة.",
    "يحق لمسؤول الغسيل التقاط صور للسيارة قبل وبعد الغسيل.",
    "يحق للشركة رفض تقديم الخدمة أو استخدام التطبيق دون أن تبدي للعميل السبب.",
    "",
    "سياسة الشكاوي:",
    "• استقبال الشكاوي والملاحظات على الغسيل خلال 3 ساعات بعد الانتهاء من الغسلة.",
    "• لا يتم إعادة الحجز في حال نزول الأمطار أو موجات الغبار، ويعتبر الغسيل مكتملاً بعد الانتهاء منه.",
    "• دي واش تُخلي مسؤوليتها عن السيارة بعد الانتهاء من الغسلة والتواصل مع العميل لفتحها.",
    "• يتعين على مسؤول الغسيل التواصل مع العميل لفتح السيارة، وفي حال تأخر العميل 15 دقيقة عن فتح السيارة يحق لمسؤول الغسيل البدء بغسيل السيارة من الخارج فقط.",
    "",
    "سياسة الاسترجاع:",
    "• لا يحق للعميل طلب استرجاع المبلغ في حال وصول مسؤول الغسيل للموقع وعدم وجود سيارة العميل.",
    "• في حال وصولنا لموقع حجز غير صحيح سيتم إلغاء الحجز تلقائياً ولا يحق للعميل طلب استرجاع.",
    "",
    "سياسة الإلغاء:",
    "• في حال تم إلغاء الخدمة ويبقى على الحجز أكثر من ساعتين وأقل من 23 ساعة، يتم خصم 20% من قيمة الحجز.",
    "• إذا تم الإلغاء قبل ساعتين أو أقل من وقت الحجز، يتم خصم كامل المبلغ.",
  ],
};

export default function TermsModal({
  visible,
  onAgree,
  onClose,
}: TermsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{texts.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            {texts.rules.map((line, i) =>
              line.startsWith("•") ? (
                <Text key={i} style={styles.bullet}>
                  {line}
                </Text>
              ) : (
                <Text key={i} style={styles.paragraph}>
                  {line}
                </Text>
              )
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity onPress={onAgree} style={styles.agreeBtn}>
              <Text style={styles.agreeText}>أوافق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  close: { fontSize: 24, lineHeight: 24 },
  body: { paddingHorizontal: 16, paddingVertical: 20 },
  paragraph: { marginBottom: 12, textAlign: "right", lineHeight: 20 },
  bullet: {
    marginBottom: 6,
    textAlign: "right",
    lineHeight: 20,
    paddingLeft: 6,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "flex-end",
  },
  agreeBtn: {
    backgroundColor: "#0A3981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  agreeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
