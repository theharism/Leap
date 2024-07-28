import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tabs.Screen name="Daily Activity" />
      <Tabs.Screen name="Activity Reports" />
      <Tabs.Screen name="Effectiveness Report" />
    </Tabs>
  );
}
