import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/redux/features/userSlice";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);

  //   useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const storedUserString = await AsyncStorage.getItem("user");

  //       console.log("123", storedUserString);
  //       if (storedUserString !== null) {
  //         dispatch(setUser({ user: JSON.parse(storedUserString) }));
  //       }
  //     } catch (error) {
  //       console.error("Error loading user from AsyncStorage:", error);
  //     }
  //   };
  //   loadUser();
  // }, []);

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
