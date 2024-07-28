import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { theme } from "../../../src/constants/theme";
import { formattedDate } from "../../../src/utils/currentDate&Day";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";

const Activity = ({ text, status, goals, achieved, color }) => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.secondary,
        padding: 10,
        margin: 20,
        borderRadius: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            textAlign: "justify",
            flexWrap: "wrap",
          }}
        >
          {text}
        </Text>
        <View
          style={{
            backgroundColor: color,
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderRadius: 7,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "justify",
              flexWrap: "wrap",
              color: theme.colors.secondary,
            }}
          >
            {status}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 15,
        }}
      >
        {Array.from({ length: goals }).map((_, index) => (
          <View
            key={index}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: index < achieved ? color : "#d9d9d9",
              alignItems: "center",
              justifyContent: "center",
              margin: 2.5,
            }}
          >
            <Text style={{ color: "#585454", fontWeight: "bold" }}>
              {index + 1}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 7,
            }}
          >
            <MaterialIcons
              name="loop"
              size={25}
              color="#ff5757"
              style={{ marginRight: 2 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 2,
              }}
            >
              7
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 7,
            }}
          >
            <MaterialIcons
              name="loop"
              size={25}
              color="#ff5757"
              style={{ marginRight: 2 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 2,
              }}
            >
              86%
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <EvilIcons
            name="calendar"
            size={34}
            color="black"
            style={{ marginHorizontal: 3 }}
          />
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="black"
          />
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="#d9d9d9"
            style={{ marginHorizontal: 3 }}
          />
        </View>
      </View>
    </View>
  );
};

const DailyActivity = () => {
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
          justifyContent: "center",
          paddingBottom: 20,
          flexGrow: 1,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewStyle}
      >
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

        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Activity
            text={"Prospects Reached for Appointments"}
            goals={10}
            achieved={6}
            status={"P"}
            color={"#ff5757"}
          />

          <Activity
            text={"Appointments Kept"}
            goals={10}
            achieved={6}
            status={"A"}
            color={"#ffca08"}
          />

          <Activity
            text={"Sales with Initial Premium"}
            goals={3}
            achieved={1}
            status={"S"}
            color={"#00bf63"}
          />
        </View>
      </ScrollView>
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
