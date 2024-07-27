import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { theme } from "../../src/constants/theme";

const Home = () => {
  const Module = ({ text }) => {
    return (
      <View
        style={{
          backgroundColor: "orange",
          marginVertical: 10,
          marginHorizontal: 10,
          padding: 20,
          height: "28%",
          borderRadius: 25,
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={{
            color: theme.colors.secondary,
            fontStyle: "italic",
            fontWeight: "bold",
            textAlignVertical: "bottom",
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />

      <View
        style={{
          justifyContent: "center",
          paddingTop: 50,
          paddingBottom: 10,
          //   backgroundColor: "red",
          paddingHorizontal: 10,
          flexGrow: 1,
        }}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={{ alignSelf: "center" }}
        />

        <Text
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: "300",
            marginTop: 5,
            color: theme.colors.secondary,
          }}
        >
          My Sales Coach
        </Text>
        <Image
          source={require("../../../assets/welcome.png")}
          style={{ alignSelf: "center", marginTop: 20 }}
        />

        <View
          style={{
            // backgroundColor: "yellow",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Module text={"Track sales activity"} />
          <Module text={"Ask my coach"} />
          <Module text={"Watch masterclass"} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {},
});
