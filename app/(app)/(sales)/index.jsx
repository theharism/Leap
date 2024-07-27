import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../../src/constants/theme";
import LeapTextInput from "../../src/components/LeapTextInput";

const index = () => {
  const [salesTargets, setSalesTargets] = useState("");
  const [salesTargetsError, setSalesTargetsError] = useState(false);

  const [averageCaseSize, setAverageCaseSize] = useState("");
  const [averageCaseSizeError, setAverageCaseSizeError] = useState(false);

  const [numberOfWeeks, setNumberOfWeeks] = useState("");
  const [numberOfWeeksError, setNumberOfWeeksError] = useState(false);

  const [prospectingApproach, setProspectingApproach] = useState("");
  const [prospectingApproachError, setProspectingApproachError] =
    useState(false);

  const [appointmentsKept, setAppointmentsKept] = useState("");
  const [appointmentsKeptError, setAppointmentsKeptError] = useState(false);

  const [salesSubmitted, setSalesSubmitted] = useState("");
  const [salesSubmittedError, setSalesSubmittedError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={theme.colors.background}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            justifyContent: "center",
            paddingBottom: 50,
            paddingHorizontal: 10,
            flexGrow: 1,
            // backgroundColor: "yellow",
          }}
          bounces={false}
          style={styles.scrollViewStyle}
        >
          <Image
            source={require("../../../assets/logo.png")}
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

          <View
            style={{
              marginTop: 30,
              justifyContent: "space-between",
            }}
          >
            <LeapTextInput
              label="Sales Targets $ "
              value={salesTargets}
              keyboardType={"email-address"}
              autoComplete={"email"}
              onChangeText={(text) => setSalesTargets(text)}
              isError={salesTargetsError}
            />
            <LeapTextInput
              label={"Average Case Size $ "}
              value={averageCaseSize}
              onChangeText={(text) => setAverageCaseSize(text)}
              isError={averageCaseSizeError}
            />
            <LeapTextInput
              label="# of Weeks "
              value={numberOfWeeks}
              keyboardType={"email-address"}
              autoComplete={"email"}
              onChangeText={(text) => setNumberOfWeeks(text)}
              isError={numberOfWeeksError}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "300",
                marginTop: 25,
                color: "#e8bf27",
              }}
            >
              My Success Formula
            </Text>

            <LeapTextInput
              label={"# ProspectMying Approach"}
              value={prospectingApproach}
              onChangeText={(text) => setProspectingApproach(text)}
              isError={prospectingApproachError}
            />
            <LeapTextInput
              label="# Appointments Kept"
              value={appointmentsKept}
              keyboardType={"email-address"}
              autoComplete={"email"}
              onChangeText={(text) => setAppointmentsKept(text)}
              isError={appointmentsKeptError}
            />
            <LeapTextInput
              label={"# SalesMy Submitted"}
              value={salesSubmitted}
              onChangeText={(text) => setSalesSubmitted(text)}
              isError={salesSubmittedError}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showAlert && (
        <AlertMessage
          message={errorMessage}
          onPressOk={() => setShowAlert(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {
    padding: 15,
  },
});
