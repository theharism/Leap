import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Daily Activity",
          tabBarIcon: () => <Feather name="activity" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="Activity Reports"
        options={{
          tabBarIcon: () => (
            <Entypo name="text-document" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Effectiveness Report"
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Annual Progress"
        options={{
          tabBarIcon: () => (
            <FontAwesome6 name="bars-progress" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
