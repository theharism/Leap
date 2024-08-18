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
import { setUser } from "./src/redux/features/userSlice";
import * as Location from "expo-location";

import { store } from "./src/redux/store";
import useSocket from "./src/hooks/useSocket";
import { setCurrentCoordinates } from "./src/redux/features/locationSlice";

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
              sendEvent("agentLocation", {
                latitude,
                longitude,
                agentId: user?._id,
                agentName: user?.fullName,
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

    if (socket && user) {
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
