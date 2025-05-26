// import React from "react";
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";

// export function ConfirmButton({
//   onPress,
//   loading,
// }: {
//   onPress: () => void;
//   loading: boolean;
// }) {
//   return (
//     <TouchableOpacity
//       style={[styles.btn, loading && styles.disabled]}
//       onPress={onPress}
//       disabled={loading}
//       activeOpacity={0.7}
//     >
//       {loading ? (
//         <ActivityIndicator size="small" color="#fff" />
//       ) : (
//         <Text style={styles.text}>تأكيد الحجز</Text>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   btn: {
//     backgroundColor: "#0A3981",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 100,
//   },
//   text: { color: "white", fontSize: 16, fontWeight: "bold" },
//   disabled: { opacity: 0.7 },
// });
