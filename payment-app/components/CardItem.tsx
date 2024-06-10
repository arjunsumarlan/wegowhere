import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card } from "@/context";

interface CardItemProps {
  card: Card;
  onPress: (card: Card) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(card)} style={styles.card}>
      <Image
        style={styles.cardLogo}
        source={
          card.brand === "Visa"
            ? require("@/assets/images/visa.png")
            : card.brand === "MasterCard"
            ? require("@/assets/images/mastercard-logo.png")
            : card.brand === "JCB"
            ? require("@/assets/images/jcb-logo.png")
            : require("@/assets/images/visa.png")
        }
      />
      <View style={styles.cardNumberContainer}>
        {Array(3)
          .fill(1)
          .map((_, i) => (
            <Text key={i} style={styles.cardNumber}>
              {"\u2022\u2022\u2022\u2022 "}
            </Text>
          ))}
        <Text style={styles.cardNumber}>{card.cardNumber.slice(-4)}</Text>
      </View>
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.cardLabel}>Name on Card</Text>
          <Text style={styles.cardName}>{card.nameOnCard}</Text>
        </View>
        <View style={{ marginRight: 25 }}>
          <Text style={styles.cardLabel}>Expires</Text>
          <Text style={styles.cardExpiry}>{card.expiryDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    flexDirection: "column",
  },
  cardLogo: {
    width: 60,
    height: 30,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardNumberContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 24,
    fontFamily: "FCSubjectRounded",
    fontWeight: "bold",
    marginRight: 15,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: "FCSubjectRounded",
    color: "gray",
  },
  cardName: {
    fontSize: 16,
    fontFamily: "FCSubjectRounded",
    marginTop: 5,
  },
  cardExpiry: {
    fontSize: 16,
    fontFamily: "FCSubjectRounded",
    marginTop: 5,
  },
});

export default CardItem;
