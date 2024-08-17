import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStack from "./src/navigation/AppStack";
import AuthStack from "./src/navigation/AuthStack";
import { setUser } from "./src/redux/features/userSlice";
import useLocationTracking from "./src/hooks/useLocationTracking";
import { store } from "./src/redux/store";

function StartUp() {
  useLocationTracking();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.User?.token);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return token ? <AppStack /> : <AuthStack />;
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
