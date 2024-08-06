import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/redux/features/userSlice";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const [loading, setLoading] = useState(true); // Add loading state

  const loadUser = async () => {
    try {
      const storedUserString = await AsyncStorage.getItem("user");

      if (storedUserString) {
        dispatch(setUser({ user: JSON.parse(storedUserString) }));
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    // Return a loading spinner or nothing while loading
    return <Text style={{ alignSelf: "center" }}>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(sales)" />
    </Stack>
  );
}
