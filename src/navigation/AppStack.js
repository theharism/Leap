import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import Home from "../screens/home";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/userSlice";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Sales from "../screens/sales";
import AgentTracking from "../screens/Agent Tracking";
import { theme } from "../constants/theme";
import { TouchableOpacity } from "react-native";
import DailyActivity from "../screens/Daily Activity";
import ActivityReports from "../screens/Activity Reports";
import EffectivenessReport from "../screens/Effectiveness Report";
import AnnualProgress from "../screens/Annual Progress";
import Octicons from "@expo/vector-icons/Octicons";
import DailySchedule from "../screens/Daily Schedule";
import Inbox from "../screens/Inbox";
import Chat from "../screens/Chat";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log Out" onPress={props.handleLogout} />
    </DrawerContentScrollView>
  );
}

const TabNav = () => {
  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen
        name="Daily Activity"
        component={DailyActivity}
        options={{
          tabBarLabel: "Daily Activity",
          tabBarIcon: () => <Feather name="activity" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="Activity Reports"
        component={ActivityReports}
        options={{
          tabBarIcon: () => (
            <Entypo name="text-document" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Effectiveness Report"
        component={EffectivenessReport}
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
        component={AnnualProgress}
        options={{
          tabBarIcon: () => (
            <FontAwesome6 name="bars-progress" size={24} color="black" />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

const DrawerNav = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}
      initialRouteName="tabs"
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
        name="tabs"
        component={TabNav}
        options={{
          drawerLabel: "Overview",
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={Sales}
        options={{
          drawerLabel: "Sales Targets",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Daily Schedule"
        component={DailySchedule}
        options={{
          drawerLabel: "Daily Schedule",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Inbox"
        component={Inbox}
        options={{
          drawerLabel: "Inbox",
          title: "",
        }}
      />
    </Drawer.Navigator>
  );
};

const ManagerDrawerNav = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}
      initialRouteName="Agent Tracking"
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
        name="Agent Tracking"
        component={AgentTracking}
        options={{
          drawerLabel: "Agent Tracking",
        }}
      />
      <Drawer.Screen
        name="Daily Schedule"
        component={DailySchedule}
        options={{
          drawerLabel: "Daily Schedule",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Inbox"
        component={Inbox}
        options={{
          drawerLabel: "Inbox",
          title: "",
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack = () => {
  const role = useSelector((state) => state.User?.role);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {role === "agent" && (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Agent" component={DrawerNav} />
        </>
      )}
      {role === "admin" && (
        <>
          <Stack.Screen name="Manager" component={ManagerDrawerNav} />
        </>
      )}

      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};
