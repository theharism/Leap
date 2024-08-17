import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { privateApi } from "../api/axios";
import { theme } from "../constants/theme";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
const handleDelete = () => {
  console.log("Deleted");
};

const renderRightActions = () => {
  return (
    <Pressable onPress={handleDelete} style={styles.deleteButton}>
      <Ionicons name={"trash-outline"} size={20} color={"#ffffff"} />
    </Pressable>
  );
};

const InboxComponent = ({ image, username, time, message }) => (
  <TouchableOpacity>
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.inboxContainer}>
        <View style={styles.leftSideView}>
          {/* <Image
            source={{ uri: image } || require("../../assets/profile.png")}
            style={styles.avatar}
          /> */}
          <View>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>

        <View style={styles.rightSideView}>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </Swipeable>
  </TouchableOpacity>
);

const Inbox = () => {
  const token = useSelector((state) => state.User?.token);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      privateApi(token)
        .get(`/inbox`)
        .then((res) => {
          console.log(res.data);
          setChats(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={{ backgroundColor: "#000" }} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",

          //   backgroundColor: "black",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            // backgroundColor: "red",
            fontWeight: "300",
            textAlign: "justify",
            flexWrap: "wrap",
            color: theme.colors.secondary,
          }}
        >
          Inbox
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <EvilIcons
            name="calendar"
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }}
          />
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="white"
          />
          {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
        </View>
      </View>

      <View style={styles.inboxContainerTop}>
        <FlatList
          data={chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <InboxComponent
              time={item.time}
              message={item.message}
              username={item.username}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  goBack: {
    marginLeft: 20,
    alignItems: "flex-start",
    // marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  inboxText: {
    fontSize: 24,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  inboxContainerTop: {
    width: "100%",
    alignItems: "flex-end",
  },
  inboxContainer: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    marginBottom: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  leftSideView: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSideView: {
    justifyContent: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  userName: {
    fontSize: 14,
    fontFamily: "SFPro-700",
  },
  message: {
    fontSize: 14,
    fontFamily: "SFPro-400",
    color: "#3C3C3C",
  },
  time: {
    fontSize: 12,
    fontFamily: "SFPro-400",
  },
  deleteButton: {
    backgroundColor: "#C64B31",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "85%",
    marginRight: 15,
    borderRadius: 10,
  },
});
