import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { theme } from "../../src/constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { privateApi } from "../../src/api/axios";
import {
  setDailyAchieved,
  setEntries,
  setWeeklyAchieved,
} from "../../src/redux/features/entriesSlice";
export default function SalesLayout() {
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      privateApi(token)
        .get("/entries")
        .then((res) => {
          dispatch(setEntries({ entries: res.data.entries }));
        })
        .catch((err) => console.error(err));

      privateApi(token)
        .get(`/pas/daily?date=${new Date().toLocaleDateString()}`)
        .then((res) => {
          console.log(res.data);
          dispatch(setDailyAchieved({ daily: res.data.pas }));
        })
        .catch((err) => console.error(err));

      privateApi(token)
        .get(`/pas/weekly?date=${new Date().toLocaleDateString()}`)
        .then((res) => {
          dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

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
        name="entries"
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
