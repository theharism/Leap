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
import ProgressBar from "../../../src/components/ProgressBar";
import { useSelector } from "react-redux";

const Category = ({ goals, achieved, text, backgroundColor }) => {
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
          {goals}
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
          {achieved}
        </Text>
      </View>
      <View>
        <ProgressBar
          percentage={Number((achieved / goals) * 100 || 0).toFixed(0)}
        />
      </View>
    </View>
  );
};

const ActivityReports = () => {
  const entries = useSelector((state) => state.Entries);

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
          <Category
            text={"P"}
            goals={entries?.daily_goals?.p_daily || 0}
            achieved={entries?.daily_achieved?.p_daily || 0}
            backgroundColor={"#ff5757"}
          />
          <Category
            text={"A"}
            goals={entries?.daily_goals?.a_daily || 0}
            achieved={entries?.daily_achieved?.a_daily || 0}
            backgroundColor={"#ffca08"}
          />
          <Category
            text={"S"}
            goals={entries?.daily_goals?.s_daily || 0}
            achieved={entries?.daily_achieved?.s_daily || 0}
            backgroundColor={"#00bf63"}
          />
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
          <Category
            text={"P"}
            goals={entries?.weekly_goals?.p_weekly || 0}
            achieved={entries?.weekly_achieved?.p_weekly || 0}
            backgroundColor={"#ff5757"}
          />
          <Category
            text={"A"}
            goals={entries?.weekly_goals?.a_weekly || 0}
            achieved={entries?.weekly_achieved?.a_weekly || 0}
            backgroundColor={"#ffca08"}
          />
          <Category
            text={"S"}
            goals={entries?.weekly_goals?.s_weekly || 0}
            achieved={entries?.weekly_achieved?.s_weekly || 0}
            backgroundColor={"#00bf63"}
          />
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
