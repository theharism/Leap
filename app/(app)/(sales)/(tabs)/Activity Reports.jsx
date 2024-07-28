import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { theme } from "../../../src/constants/theme";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import ProgressBar from "../../../src/components/ProgressBar";

const ActivityReports = () => {
  const Category = ({ text, backgroundColor }) => {
    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          flexDirection: "row",
          paddingHorizontal: 20,
          marginVertical: 5,
          borderRadius: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: theme.colors.secondary,
          }}
        >
          {text}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="loop"
            size={40}
            color="white"
            style={{ marginRight: 3 }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.colors.secondary,
              marginLeft: 3,
            }}
          >
            5
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="loop"
            size={40}
            color="white"
            style={{ marginRight: 3 }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.colors.secondary,
              marginLeft: 3,
            }}
          >
            5
          </Text>
        </View>
        <View>
          <ProgressBar percentage={70} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollViewStyle}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            //   backgroundColor: "black",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              // backgroundColor: "red",
              fontWeight: "300",
              color: theme.colors.secondary,
            }}
          >
            Activity Reports
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // backgroundColor: "red",
              justifyContent: "space-between",
            }}
          >
            <EvilIcons
              name="calendar"
              size={34}
              color="white"
              style={{ marginHorizontal: 3 }}
            />
            <MaterialCommunityIcons
              name="progress-check"
              size={28}
              style={{ marginHorizontal: 3 }}
              color="white"
            />
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 21,
              // backgroundColor: "red",
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Daily Progress
          </Text>
          <Category text={"P"} backgroundColor={"#ff5757"} />
          <Category text={"A"} backgroundColor={"#ffca08"} />
          <Category text={"S"} backgroundColor={"#00bf63"} />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 21,
              // backgroundColor: "red",
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Weekly Progress
          </Text>
          <Category text={"P"} backgroundColor={"#ff5757"} />
          <Category text={"A"} backgroundColor={"#ffca08"} />
          <Category text={"S"} backgroundColor={"#00bf63"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityReports;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 15,
  },
});
