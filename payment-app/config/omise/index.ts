import omise from "omise-react-native";
import { Alert } from "react-native";
import { Card } from "../../context";

export const PAYMENT_UNAVAILABLE =
  "We were unable to create your card at this time. Please review your details and give it another try.";

export const OMISE_CONFIG = {
  PUBLIC_KEY: "pkey_*******",
  SECRET_KEY: "skey_*******",
};

omise.config(OMISE_CONFIG.PUBLIC_KEY, OMISE_CONFIG.SECRET_KEY);

export async function omiseCharge(
  card: Card,
  callback: () => void
): Promise<void> {
  try {
    const { nameOnCard, cardNumber, expiryDate, cvv } = card;
    const [month, year] = expiryDate.split("/");
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
    if (token?.id) {
      const response = await fetch("https://api.omise.co/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(OMISE_CONFIG.SECRET_KEY + ":")}`,
        },
        body: `amount=100000&currency=thb&card=${token.id}`,
      });

      const responseData = await response.json();
      if (response.ok) {
        Alert.alert(
          "Payment Successful",
          `You have paid with card ending in ${cardNumber.slice(-4)}`
        );
      } else {
        Alert.alert("Payment Failed", responseData.message);
      }
    } else {
      Alert.alert("Payment Failed", PAYMENT_UNAVAILABLE);
    }
  } catch (error) {
    Alert.alert("Error", "Something went wrong");
    console.error(error);
  } finally {
    callback();
  }
}

export default omise;
