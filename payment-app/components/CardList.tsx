import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Card, useCardContext } from "@/context";
import { useLoading } from "@/hooks";
import { omiseCharge } from "@/config/omise";

const CardList: React.FC = () => {
  const { cards } = useCardContext();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const { loading, withLoading } = useLoading();

  const handleCardPress = (card: Card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleConfirmPayment = async () => {
    if (selectedCard) {
      await omiseCharge(selectedCard, () => setModalVisible(false));
    } else {
      Alert.alert("Payment Failed", "Please select the correct card.");
    }
  };

  const renderItem = ({ item }: { item: Card }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
      <Image
        style={styles.cardLogo}
        source={
          item.brand === "Visa"
            ? require("@/assets/images/visa.png")
            : item.brand === "MasterCard"
            ? require("@/assets/images/mastercard-logo.png")
            : item.brand === "JCB"
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
        <Text style={styles.cardNumber}>{item.cardNumber.slice(-4)}</Text>
      </View>
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.cardLabel}>Name on Card</Text>
          <Text style={styles.cardName}>{item.nameOnCard}</Text>
        </View>
        <View style={{ marginRight: 25 }}>
          <Text style={styles.cardLabel}>Expires</Text>
          <Text style={styles.cardExpiry}>{item.expiryDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to pay with this card?
          </Text>
          <Text style={styles.modalCardNumber}>
            **** **** **** {selectedCard?.cardNumber.slice(-4)}
          </Text>
          {loading ? (
            <View style={styles.modalButtons}>
              <View style={styles.modalButton}>
                <ActivityIndicator color="#fff" />
              </View>
            </View>
          ) : (
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => withLoading(handleConfirmPayment)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 20,
  },
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
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalText: {
    fontSize: 18,
    fontFamily: "FCSubjectRounded",
    marginBottom: 20,
  },
  modalCardNumber: {
    fontSize: 18,
    fontFamily: "FCSubjectRounded",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#00bcd4",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "FCSubjectRounded",
  },
});

export default CardList;
