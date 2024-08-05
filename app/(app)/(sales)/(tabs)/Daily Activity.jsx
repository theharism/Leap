import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../../../src/constants/theme";
import { formattedDate } from "../../../src/utils/currentDate&Day";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { privateApi } from "../../../src/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setDailyAchieved } from "../../../src/redux/features/entriesSlice";

const Activity = ({ text, status, goals, achieved, color, onPress }) => {
  const [page, setPage] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const itemSize = page === 0 ? 45 : 50;
  const itemsPerPage = Math.floor(screenWidth / itemSize);

  const data = Array.from({ length: 50 }, (_, index) => index + 1);

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {index == 0 && page > 0 && (
          <Ionicons
            onPress={() => setPage(page - 1)}
            name="caret-back"
            size={24}
            color="black"
          />
        )}
        <TouchableOpacity
          key={item}
          onPress={() => onPress(item)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: item <= achieved ? color : "#d9d9d9",
            alignItems: "center",
            justifyContent: "center",
            margin: 2.5,
          }}
        >
          <Text style={{ color: "#585454", fontWeight: "bold" }}>{item}</Text>
        </TouchableOpacity>

        {index == itemsPerPage - 1 && (
          <Ionicons
            onPress={() => setPage(page + 1)}
            name="caret-forward"
            size={24}
            color="black"
          />
        )}
      </View>
    );
  };

  const paginatedData = data.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.secondary,
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 15,
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
            maxWidth: "95%",
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

      <View>
        <FlatList
          data={paginatedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        />
      </View>

      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 15,
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(index + 1)}
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
          </TouchableOpacity>
        ))}
      </View> */}

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
              {goals}
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
              {Number((achieved / goals) * 100).toFixed(0)}%
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
  const entries = useSelector((state) => state.Entries);
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();

  const updateAchievements = (data) => {
    privateApi(token)
      .post("/pas", data)
      .then((res) => {
        dispatch(setDailyAchieved({ daily: res.data.pas }));
        ToastAndroid.show("Updated", ToastAndroid.SHORT);
      })
      .catch((err) => console.error(err));
  };

  console.log(entries);

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
            marginTop: 30,
            color: "#e8bf27",
          }}
        >
          Daily Activity Achievement
        </Text>

        <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 30 }}>
          <Activity
            text={"Prospects Reached for Appointments"}
            goals={entries?.daily_goals?.p_daily}
            achieved={entries?.daily_achieved?.p_daily}
            status={"P"}
            color={"#ff5757"}
            onPress={(value) =>
              updateAchievements({
                p_daily: value,
                date: new Date().toLocaleDateString(),
              })
            }
          />

          <Activity
            text={"Appointments Kept"}
            goals={entries?.daily_goals?.a_daily}
            achieved={entries?.daily_achieved?.a_daily}
            status={"A"}
            onPress={(value) =>
              updateAchievements({
                a_daily: value,
                date: new Date().toLocaleDateString(),
              })
            }
            color={"#ffca08"}
          />

          <Activity
            text={"Sales with Initial Premium"}
            goals={entries?.daily_goals?.s_daily}
            achieved={entries?.daily_achieved?.s_daily}
            status={"S"}
            onPress={(value) =>
              updateAchievements({
                s_daily: value,
                premium_daily: value * entries?.SalesTargets?.averageCaseSize,
                date: new Date().toLocaleDateString(),
              })
            }
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
