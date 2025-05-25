import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
          <Text
            style={[
              styles.star,
              star <= rating ? styles.active : styles.inactive,
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  star: {
    fontSize: 28,
    marginHorizontal: 4,
  },
  active: {
    color: "#FFD700", // gold/yellow
  },
  inactive: {
    color: "#ccc",
  },
});
