import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const session = null;

  if (session) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
