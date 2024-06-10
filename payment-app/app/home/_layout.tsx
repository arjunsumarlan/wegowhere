import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CardList from "@/components/CardList";
import { useCardContext } from "@/context/CardContext";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { cards } = useCardContext();

  return (
    <>
      {!cards.length ? (
        <View style={styles.container}>
          <>
            <Image
              style={styles.card}
              source={require("../../assets/images/card.png")}
            />
            <Text style={styles.noCardText}>No Cards Found</Text>
            <Text style={styles.recommendText}>
              We recommend adding a card for easy payment
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("addcard" as never)}
            >
              <Text style={styles.buttonStyle}>Add New Card</Text>
            </TouchableOpacity>
          </>
        </View>
      ) : (
        <CardList />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonStyle: {
    fontSize: 18,
    fontFamily: "FCSubjectRounded",
    color: "#4AD8DA",
    marginBottom: 10,
  },
  card: {
    width: 80,
    height: 50,
    marginBottom: 20,
    resizeMode: "contain",
  },
  noCardText: {
    fontSize: 18,
    fontFamily: "FCSubjectRounded",
    marginBottom: 10,
  },
  recommendText: {
    fontSize: 18,
    fontFamily: "FCSubjectRounded",
    marginBottom: 20,
    width: 250,
    textAlign: "center",
  },
});

export default HomeScreen;
