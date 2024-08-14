import { Stack, useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { theme } from "../../src/constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { privateApi } from "../../src/api/axios";
import {
  setDailyAchieved,
  setEntries,
  setWeeklyAchieved,
  setYearlyAchieved,
} from "../../src/redux/features/entriesSlice";
import Octicons from "@expo/vector-icons/Octicons";
import { TouchableOpacity } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import Loader from "../../src/components/Loader";
import { logoutUser } from "../../src/redux/features/userSlice";
export default function SalesLayout() {
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Clear user data
    // await AsyncStorage.removeItem("user");
    dispatch(logoutUser());
    // Navigate to the login screen
    navigation.navigate("signin");
  };

  useEffect(() => {
    if (token) {
      privateApi(token)
        .get("/entries")
        .then((res) => {
          dispatch(setEntries({ entries: res.data.entries }));
        })
        .catch((err) => {
          console.error(err.response);
          if (err.response.status === 500) {
            handleLogout();
          }
        });

      privateApi(token)
        .get(`/pas/daily?date=${new Date().toLocaleDateString("en-GB")}`)
        .then((res) => {
          dispatch(setDailyAchieved({ daily: res.data.pas }));
        })
        .catch((err) => console.error(err));

      privateApi(token)
        .get(`/pas/weekly?date=${new Date().toLocaleDateString("en-GB")}`)
        .then((res) => {
          dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <>
      <Drawer
        initialRouteName="(tabs)"
        screenOptions={{
          title: "",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            >
              <Octicons
                name="three-bars"
                size={24}
                color="white"
                style={{ marginLeft: 30 }}
              />
            </TouchableOpacity>
          ),
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
          listeners={{
            focus: () => {
              handleLogout();
            },
          }}
        />
      </Drawer>

      {loading && <Loader />}
    </>
  );
}
