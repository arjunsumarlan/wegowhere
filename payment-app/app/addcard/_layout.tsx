import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import omise, { PAYMENT_UNAVAILABLE } from "@/config/omise";
import { Card, initialCardState, useCardContext } from "@/context";
import { useLoading, useForm } from "@/hooks";

const AddCardScreen: React.FC = () => {
  const { formState, handleChange, resetForm } = useForm<Card>(initialCardState);
  const { loading, withLoading } = useLoading();
  const navigation = useNavigation();
  const { addCard } = useCardContext();

  const handleAddCard = async () => {
    const { cardNumber, nameOnCard, expiryDate, cvv } = formState;
    if (cardNumber && nameOnCard && expiryDate && cvv) {
      const [month, year] = expiryDate.split("/");

      try {
        const token = await omise.createToken({
          card: {
            name: nameOnCard,
            city: "Bangkok",
            postal_code: 10320,
            number: cardNumber.replace(/\s/g, ""),
            expiration_month: parseInt(month),
            expiration_year: parseInt(`20${year}`),
            security_code: parseInt(cvv),
          },
        });

        if (token?.card) {
          Alert.alert("Success", "Card added successfully");
          addCard({
            cardNumber,
            nameOnCard,
            expiryDate,
            cvv,
            brand: token.card.brand,
          });
          resetForm();
          navigation.goBack();
        } else {
          Alert.alert("Card Creation Failed", PAYMENT_UNAVAILABLE);
        }
      } catch (error) {
        Alert.alert("Card Creation Failed", PAYMENT_UNAVAILABLE);
        console.error(error);
      }
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  const handleCardNumberChange = (text: string) => {
    const formatedCardNumber = text
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    if (formatedCardNumber.length <= 19) {
      handleChange("cardNumber", formatedCardNumber);
    } else {
      handleChange("cardNumber", formatedCardNumber.slice(0, 19));
    }
  };

  const handleExpiryDateChange = (text: string) => {
    // Filter out invalid characters
    const matchText = text.match(/[0-9/]+/g);
    const cleanedText = matchText ? matchText[0] : text;

    const parseValidMonth = (monthText: string): string => {
      let month = parseInt(monthText);
      if (month > 12) return monthText.slice(0, 1);
      if (month == 0 || !monthText.length) return monthText;
      return month < 10 && monthText.length > 1 ? `0${month}` : `${month}`;
    };

    const handleMonth = (text: string): string => {
      const month = parseValidMonth(text);
      return month;
    };

    const handleYear = (month: string, yearText: string): string => {
      let year = yearText.slice(0, 2);
      return `${month}/${year}`;
    };

    if (cleanedText.length < 3) {
      const month = handleMonth(cleanedText);
      handleChange("expiryDate", month);
    } else if (cleanedText.includes("/")) {
      const [monthText, yearText] = cleanedText.split("/");
      const month = handleMonth(monthText);
      const formattedExpiryDate = handleYear(month, yearText);
      handleChange("expiryDate", formattedExpiryDate);
    } else if (cleanedText.length === 3 && !cleanedText.includes("/")) {
      const formattedExpiryDate = `${cleanedText.slice(
        0,
        2
      )}/${cleanedText.slice(2)}`;
      handleChange("expiryDate", formattedExpiryDate);
    } else {
      handleChange("expiryDate", cleanedText);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ATM/Debit/Credit card number</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputCard}
          placeholder="0000 0000 0000 0000"
          value={formState.cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
        />
        <View style={styles.cardLogosContainer}>
          <Image
            style={styles.cardLogo}
            source={require("@/assets/images/visa-logo.png")}
          />
          <Image
            style={styles.cardLogo}
            source={require("@/assets/images/mastercard-logo.png")}
          />
          <Image
            style={styles.cardLogo}
            source={require("@/assets/images/jcb-logo.png")}
          />
        </View>
      </View>
      <Text style={styles.label}>Name on Card</Text>
      <TextInput
        style={styles.input}
        placeholder="Ty Lee"
        value={formState.nameOnCard}
        onChangeText={(text) => handleChange("nameOnCard", text)}
      />
      <View style={styles.expiryCvvContainer}>
        <View style={styles.expiryCvvItem}>
          <Text style={styles.label}>Expiry date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={formState.expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.expiryCvvItem}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={formState.cvv}
            onChangeText={(text) => handleChange("cvv", text)}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.verifiedContainer}>
        <Image
          style={styles.verifiedLogo}
          source={require("@/assets/images/visa-verified.png")}
        />
        <Image
          style={styles.verifiedLogo}
          source={require("@/assets/images/mastercard-verified.png")}
        />
        <Image
          style={styles.verifiedLogo}
          source={require("@/assets/images/omise-verified.png")}
        />
      </View>
      <TouchableOpacity
        disabled={loading}
        style={styles.addButton}
        onPress={() => withLoading(handleAddCard)}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Card</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontFamily: "FCSubjectRounded",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    maxHeight: 50,
    borderColor: "#E6E3E6",
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 90,
    fontFamily: "FCSubjectRounded",
  },
  inputCard: {
    flex: 1,
    maxHeight: 50,
    paddingVertical: 10,
    borderColor: "#E6E3E6",
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "FCSubjectRounded",
  },
  cardLogosContainer: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  cardLogo: {
    width: 25,
    marginLeft: 5,
    resizeMode: "contain",
  },
  expiryCvvContainer: {
    flex: 1,
    maxHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  expiryCvvItem: {
    flex: 1,
    marginRight: 10,
  },
  verifiedContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  verifiedLogo: {
    width: 40,
    height: 27.5,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#00bcd4",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "FCSubjectRounded",
  },
});

export default AddCardScreen;
