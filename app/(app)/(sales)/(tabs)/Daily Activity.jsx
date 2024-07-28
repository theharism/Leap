import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { theme } from "../../../src/constants/theme";
import { formattedDate } from "../../../src/utils/currentDate&Day";

const DailyActivity = () => {
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />
      <Image
        source={require("../../../../assets/logo.png")}
        style={{ alignSelf: "center" }}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 32,
          fontWeight: "300",
          marginTop: 25,
          color: theme.colors.secondary,
        }}
      >
        My Sales Coach
      </Text>

      <Text
        style={{
          textAlign: "center",
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 25,
          color: "#e8bf27",
        }}
      >
        {formattedDate}
      </Text>

      <Text
        style={{
          textAlign: "center",
          fontSize: 28,
          fontWeight: "300",
          marginTop: 25,
          color: "#e8bf27",
        }}
      >
        Daily Activity Achievement
      </Text>
    </SafeAreaView>
  );
};

export default DailyActivity;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
