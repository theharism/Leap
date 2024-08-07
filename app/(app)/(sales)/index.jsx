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
import React, { useEffect, useState } from "react";
import { theme } from "../../src/constants/theme";
import LeapTextInput from "../../src/components/LeapTextInput";
import { privateApi } from "../../src/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-paper";
import { setEntries } from "../../src/redux/features/entriesSlice";
import { isEmpty } from "../../src/utils/isEmpty";
import Loader from "../../src/components/Loader";
import { router } from "expo-router";

const index = () => {
  const token = useSelector((state) => state.User?.token);
  const entries = useSelector((state) => state.Entries);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    salesTargets: "",
    averageCaseSize: "",
    numberOfWeeks: "",
    prospectingApproach: "",
    appointmentsKept: "",
    salesSubmitted: "",
  });

  const [formErrors, setFormErrors] = useState({
    salesTargetsError: false,
    averageCaseSizeError: false,
    numberOfWeeksError: false,
    prospectingApproachError: false,
    appointmentsKeptError: false,
    salesSubmittedError: false,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: Number(value).toLocaleString(),
    }));
  };

  useEffect(() => {
    if (entries) {
      setLoading(false);
      setFormData({
        salesTargets: entries?.SalesTargets?.salesTargets || "",
        averageCaseSize: entries?.SalesTargets?.averageCaseSize
          ? Number(entries?.SalesTargets?.averageCaseSize).toLocaleString()
          : "",
        numberOfWeeks: entries?.SalesTargets?.numberOfWeeks
          ? Number(entries?.SalesTargets?.numberOfWeeks).toLocaleString()
          : "",
        prospectingApproach: entries?.SuccessFormula?.prospectingApproach
          ? Number(
              entries?.SuccessFormula?.prospectingApproach
            ).toLocaleString()
          : "",
        appointmentsKept: entries?.SuccessFormula?.appointmentsKept
          ? Number(entries?.SuccessFormula?.appointmentsKept).toLocaleString()
          : "",
        salesSubmitted: entries?.SuccessFormula?.salesSubmitted
          ? Number(entries?.SuccessFormula?.salesSubmitted).toLocaleString()
          : "",
      });
    }
  }, [entries]);

  const validateData = () => {
    const newErrors = {
      salesTargets: formData.salesTargets === "",
      averageCaseSize: formData.averageCaseSize === "",
      numberOfWeeks: formData.numberOfWeeks === "",
      prospectingApproach: formData.prospectingApproach === "",
      appointmentsKept: formData.appointmentsKept === "",
      salesSubmitted: formData.salesSubmitted === "",
    };

    setFormErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    return !hasError;
  };

  const saveEntries = () => {
    setLoading(true);

    if (validateData()) {
      if (entries?.SalesTargets?.averageCaseSize) {
        privateApi(token)
          .put("/entries", {
            salesTargets: Number(formData.salesTargets.replace(/,/g, "")),
            averageCaseSize: Number(formData.averageCaseSize.replace(/,/g, "")),
            numberOfWeeks: Number(formData.numberOfWeeks),
            prospectingApproach: Number(formData.prospectingApproach),
            appointmentsKept: Number(formData.appointmentsKept),
            salesSubmitted: Number(formData.salesSubmitted),
          })
          .then((res) => {
            dispatch(setEntries({ entries: res.data.entries }));
            router.push("/(app)/(sales)/(tabs)");
          })
          .catch((err) => console.error("put", err))
          .finally(() => setLoading(false));
      } else {
        privateApi(token)
          .post("/entries", {
            salesTargets: Number(formData.salesTargets.replace(/,/g, "")),
            averageCaseSize: Number(formData.averageCaseSize.replace(/,/g, "")),
            numberOfWeeks: Number(formData.numberOfWeeks),
            prospectingApproach: Number(formData.prospectingApproach),
            appointmentsKept: Number(formData.appointmentsKept),
            salesSubmitted: Number(formData.salesSubmitted),
          })
          .then((res) => {
            dispatch(setEntries({ entries: res.data.entries }));
            router.push("/(app)/(sales)/(tabs)");
          })
          .catch((err) => console.error("post", err.response.data))
          .finally(() => setLoading(false));
      }
    }
  };

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
              label="Annual Sales Targets $ "
              value={formData.salesTargets}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange("salesTargets", text)}
              isError={formErrors.salesTargetsError}
            />
            <LeapTextInput
              label={"Average Case Size $ "}
              value={formData.averageCaseSize}
              keyboardType="numeric"
              isError={formErrors.averageCaseSizeError}
              onChangeText={(text) =>
                handleInputChange("averageCaseSize", text)
              }
            />
            <LeapTextInput
              label="# of Weeks "
              value={formData.numberOfWeeks}
              keyboardType="numeric"
              isError={formErrors.numberOfWeeksError}
              onChangeText={(text) => handleInputChange("numberOfWeeks", text)}
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
              label={"# Prospecting Approach"}
              value={formData.prospectingApproach}
              keyboardType="numeric"
              isError={formErrors.prospectingApproachError}
              onChangeText={(text) =>
                handleInputChange("prospectingApproach", text)
              }
            />
            <LeapTextInput
              label="# Appointments Kept"
              value={formData.appointmentsKept}
              keyboardType="numeric"
              isError={formErrors.appointmentsKeptError}
              onChangeText={(text) =>
                handleInputChange("appointmentsKept", text)
              }
            />
            <LeapTextInput
              label={"# Sales Submitted"}
              value={formData.salesSubmitted}
              keyboardType="numeric"
              isError={formErrors.salesSubmittedError}
              onChangeText={(text) => handleInputChange("salesSubmitted", text)}
            />

            <Button
              loading={loading}
              labelStyle={{
                fontSize: 17,
                fontFamily: "",
              }}
              textColor="#FFFFFF"
              mode="contained"
              style={{
                borderRadius: 35,
                paddingVertical: 6,
                marginTop: 30,
                backgroundColor: "#ff914d",
              }}
              onPress={saveEntries}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showAlert && (
        <AlertMessage
          message={errorMessage}
          onPressOk={() => setShowAlert(false)}
        />
      )}
      {loading && <Loader />}
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
