import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStack from "./src/navigation/AppStack";
import AuthStack from "./src/navigation/AuthStack";
import { logoutUser, setUser } from "./src/redux/features/userSlice";
import * as Location from "expo-location";

import { store } from "./src/redux/store";
import useSocket from "./src/hooks/useSocket";
import { setCurrentCoordinates } from "./src/redux/features/locationSlice";
import { privateApi } from "./src/api/axios";
import { setEntries } from "./src/redux/features/entriesSlice";
import { debounce } from "lodash";

// Define the function to send the agent location
const sendAgentLocation = async (latitude, longitude, user) => {
  try {
    const response = await privateApi(user?.token).post("/location", {
      latitude,
      longitude,
      agentId: user?._id,
      agentName: user?.fullName,
      companyName: user?.companyName,
      profilePic: user?.profilePic,
    });
  } catch (error) {
    console.error("Failed to send location:", error);
  }
};

// Debounce the function with a 2-second delay
const debouncedSendAgentLocation = debounce(sendAgentLocation, 2000);

function StartUp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const [loading, setLoading] = useState(true);
  const { sendEvent, socket } = useSocket();

  const loadUser = useCallback(async () => {
    try {
      const storedUserString = await AsyncStorage.getItem("user");

      if (storedUserString) {
        const parsedUser = JSON.parse(storedUserString);
        dispatch(setUser({ user: parsedUser }));

        privateApi(parsedUser?.token)
          .get("/entries")
          .then((res) => {
            dispatch(setEntries({ entries: res.data.entries }));
          })
          .catch((err) => {
            console.error("Error fetching entries", err.response?.data);

            if (err.response?.status === 401) {
              // Show alert and handle logout on OK
              Alert.alert(
                "Session Expired",
                "Your session has expired. Please log in again.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      dispatch(logoutUser());
                    },
                  },
                ],
                { cancelable: false } // Prevent closing the alert without user action
              );
            }
          });
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        const { status: status1 } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || status1 !== "granted") {
          console.log("Permission to access location was denied");
          Alert.alert("Error", "Permission to access location was denied");
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 20000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;

            if (user?.role === "agent") {
              debouncedSendAgentLocation(latitude, longitude, user);

              sendEvent("agentLocation", {
                latitude,
                longitude,
                agentId: user?._id,
                agentName: user?.fullName,
                companyName: user?.companyName,
                profilePic: user?.profilePic,
              });
            }
            dispatch(setCurrentCoordinates({ latitude, longitude }));
          }
        );

        return () => {
          subscription?.remove();
        };
      } catch (error) {
        console.error("Error starting location updates:", error);
      }
    };

    if (socket && user?.companyName) {
      sendEvent("joinCompanyRoom", user?.companyName);

      startLocationUpdates();
    }
  }, [socket, user, dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return user?.token ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <StartUp />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
