import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../../../src/constants/theme";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";

import { plans } from "../../../src/constants/plans";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "expo-router";
import { privateApi } from "../../../src/api/axios";
import {
  setWeeklyAchieved,
  setYearlyAchieved,
} from "../../../src/redux/features/entriesSlice";
import Loader from "../../../src/components/Loader";

const Category = ({ goal, achieved, text, backgroundColor }) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flexDirection: "row",
        paddingHorizontal: 40,
        marginVertical: 5,
        borderRadius: 5,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../../../assets/goal1.png")}
          style={{
            marginRight: 2,
            width: 45,
            height: 45,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.secondary,
            marginLeft: 3,
          }}
        >
          {goal}%
        </Text>
      </View>

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
        <Image
          source={require("../../../../assets/achieved1.png")}
          style={{
            marginRight: 2,
            width: 40,
            height: 40,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.secondary,
            marginLeft: 3,
          }}
        >
          {achieved}%
        </Text>
      </View>
    </View>
  );
};

const ImprovementPlan = ({ item }) => {
  return (
    <View
      style={{
        borderWidth: 2.5,
        borderRadius: 5,
        borderColor: "#b2b2b2",
        backgroundColor: theme.colors.secondary,
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "flex-start",
        // flexWrap:"wrap",
        maxWidth: "100%",
        // width:"100%",
      }}
    >
      <Entypo
        name="triangle-right"
        size={36}
        color={theme.colors.background}
        style={{ marginTop: -5 }}
      />
      <View style={{ alignItems: "flex-start", width: "85%" }}>
        <Text
          style={{
            fontSize: 14,
            color: "black",
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {item.heading}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "black",
            flexWrap: "wrap",
          }}
        >
          {item.subheading}
        </Text>
      </View>
    </View>
  );
};

const EffectivenessReport = () => {
  const entries = useSelector((state) => state.Entries);

  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get("/pas/annual")
          .then((res) => {
            dispatch(setYearlyAchieved({ yearly: res.data.pas }));
          })
          .catch((err) => console.error(err));

        privateApi(token)
          .get(`/pas/weekly?date=${new Date().toLocaleDateString("en-GB")}`)
          .then((res) => {
            dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const calculateSalesRatioGoal = (entries) => {
    const salesSubmitted = entries?.SuccessFormula?.salesSubmitted || 0;
    const appointmentsKept = entries?.SuccessFormula?.appointmentsKept || 0;

    return Math.floor((salesSubmitted / appointmentsKept) * 100) || 0;
  };

  const calculateSalesRatioAchieved = (entries) => {
    const yearlyAchievedA = entries?.yearly_achieved?.a_yearly;
    const yearlyAchievedS = entries?.yearly_achieved?.a_yearly;

    if (!yearlyAchievedA || !yearlyAchievedS) return 0;

    const SalesRatio = yearlyAchievedS / yearlyAchievedA;

    if (SalesRatio === 0 || isNaN(SalesRatio) || SalesRatio === Infinity) {
      return 0;
    }

    return Math.ceil(SalesRatio * 100);
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
          justifyContent: "center",
          paddingBottom: 20,
          flexGrow: 1,
          paddingHorizontal: 10,
          // backgroundColor: "yellow",
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewStyle}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            //   backgroundColor: "black",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              // backgroundColor: "red",
              fontWeight: "300",
              textAlign: "justify",
              flexWrap: "wrap",
              color: theme.colors.secondary,
            }}
          >
            Sales Effectiveness{"\n"}Report
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // backgroundColor: "red",
              justifyContent: "space-between",
              marginTop: 10,
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
            {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-start" }}>
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
            Appointment Ratio
          </Text>

          <Category
            goal={
              Math.floor(
                (entries?.SuccessFormula?.appointmentsKept /
                  entries?.SuccessFormula?.prospectingApproach) *
                  100
              ) || 0
            }
            achieved={Math.ceil(
              (entries?.yearly_achieved?.a_yearly /
                entries?.yearly_achieved?.p_yearly) *
                100 || 0
            )}
            backgroundColor={"#ffca08"}
          />

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
            Sales Ratio
          </Text>

          <Category
            goal={calculateSalesRatioGoal(entries)}
            achieved={calculateSalesRatioAchieved(entries)}
            backgroundColor={"#00bf63"}
          />
        </View>

        <View
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 5,
            paddingVertical: 10,
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: "black",
              textAlign: "center",
            }}
          >
            Improvement Plan
          </Text>
          <View>
            <FlatList
              data={plans}
              renderItem={({ item, index }) => (
                <ImprovementPlan key={index} item={item} />
              )}
            />
          </View>
        </View>
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default EffectivenessReport;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 15,
  },
});
