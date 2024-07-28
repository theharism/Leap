import {
  FlatList,
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
import { plans } from "../../../src/constants/plans";
const Category = ({ text, backgroundColor }) => {
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
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons
          name="loop"
          size={60}
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
          70%
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
        <MaterialIcons
          name="loop"
          size={60}
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
          50%
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
      }}
    >
      <Entypo
        name="triangle-right"
        size={36}
        color={theme.colors.background}
        style={{ marginTop: -5 }}
      />
      <View style={{ alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 18,
            color: "black",
          }}
        >
          {item.heading}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "black",
          }}
        >
          {item.subheading}
        </Text>
      </View>
    </View>
  );
};

const EffectivenessReport = () => {
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
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            />
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

          <Category backgroundColor={"#ffca08"} />

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

          <Category text={""} backgroundColor={"#00bf63"} />
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
              fontSize: 32,
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
