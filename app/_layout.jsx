import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useDispatch } from "react-redux";

// SplashScreen.preventAutoHideAsync();

export default function App() {
  function StartUp() {
    // const dispatch = useDispatch();
    // const api_token = useSelector((state) => state.User?.api_token);
    // useEffect(() => {
    //   if (api_token) {
    //     initPusher(api_token).then(() => console.log("Pusher Initialized"));
    //   }
    // }, [api_token]);
    // useEffect(() => {
    //   const loadUser = async () => {
    //     try {
    //       const storedUserString = await AsyncStorage.getItem("user");
    //       const storedChatString = await AsyncStorage.getItem("chat");
    //       const storedNotificationsString = await AsyncStorage.getItem(
    //         "notifications"
    //       );
    //       if (storedUserString) {
    //         dispatch(setUser({ user: JSON.parse(storedUserString) }));
    //       }
    //       if (storedNotificationsString) {
    //         dispatch(setNotifications(JSON.parse(storedNotificationsString)));
    //       }
    //       if (storedChatString) {
    //         dispatch(setChat(JSON.parse(storedChatString)));
    //       }
    //     } catch (error) {
    //       console.error("Error loading user from AsyncStorage:", error);
    //     }
    //   };
    //   loadUser();
    // }, []);
  }

  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
