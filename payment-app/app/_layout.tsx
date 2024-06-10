import { Image, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import HomeScreen from "@/app/home/_layout";
import AddCardScreen from "@/app/addcard/_layout";
import { CardProvider } from "@/context/CardContext";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    FCSubjectRoundedBold: require("@/assets/fonts/FC Subject Rounded Bold.ttf"),
    FCSubjectRounded: require("@/assets/fonts/FC Subject Rounded Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CardProvider>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          options={({ navigation }) => ({
            title: "Cards",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "FCSubjectRoundedBold" },
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("addcard")}>
                <Image
                  style={{
                    width: 20,
                    marginRight: 5,
                    resizeMode: "contain",
                  }}
                  source={require("@/assets/images/plus.png")}
                />
              </TouchableOpacity>
            ),
          })}
          component={HomeScreen}
        />
        <Stack.Screen
          name="addcard"
          options={{ title: "" }}
          component={AddCardScreen}
        />
      </Stack.Navigator>
    </CardProvider>
  );
}
