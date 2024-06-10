import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Card, useCardContext } from "@/context";
import { useLoading } from "@/hooks";
import { omiseCharge } from "@/config/omise";
import CardItem from "./CardItem";

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

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={({ item }: { item: Card }) => (
          <CardItem card={item} onPress={handleCardPress} />
        )}
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
