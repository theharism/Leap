import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/redux/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocationTracking from "../src/hooks/useLocationTracking";

export default function AppLayout() {
  useLocationTracking();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
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
  }, [loadUser]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(sales)" />
      <Stack.Screen name="(manager)" />
    </Stack>
  );
}
