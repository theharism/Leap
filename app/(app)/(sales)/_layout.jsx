import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { theme } from "../../src/constants/theme";
export default function SalesLayout() {
  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Overview",
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Sales Targets",
          title: "",
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{
          drawerLabel: "Log Out",
          title: "",
        }}
      />
    </Drawer>
  );
}
