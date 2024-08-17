import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import useSocket from "../hooks/useSocket";
import { addMessage } from "../redux/features/chatSlice";

const Chat = ({ navigation, route }) => {
  const { userId1, userId2, userName2 } = route?.params;
  const scrollViewRef = useRef();
  const dispatch = useDispatch();
  const { onEvent, sendEvent, socket } = useSocket();
  const [messageText, setMessageText] = useState("");
  const messages = useSelector((state) => state.Chat.messages);

  useEffect(() => {
    if (userId1 && userId2) {
      sendEvent("join", { userId1, userId2 });

      onEvent("receive_message", (newMessage) => {
        console.log(newMessage);

        const date = new Date();

        const formattedTime = date
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase();

        const msgObj = {
          id: Date.now(),
          message: newMessage,
          time: formattedTime,
          type: "receiver",
        };

        dispatch(addMessage({ message: msgObj, unread: 1 }));
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [userId1, userId2]);

  const sendMessage = () => {
    if (messageText.trim()) {
      sendEvent("send_message", {
        userId1,
        userId2,
        sender: userId1,
        content: messageText,
      });
      setMessageText("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerLeftSide}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              style={styles.goBack}
            />
          </Pressable>

          <View style={styles.nameContainer}>
            <Text style={{ fontSize: 15 }}>{userName2}</Text>
            <Text style={{ fontSize: 12 }}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView
          contentContainerStyle={{ padding: 20, width: "100%" }}
          ref={scrollViewRef}
        >
          {messages?.map((msg, index) => {
            return (
              <View
                key={index}
                style={
                  msg.type === "sender"
                    ? styles.senderMsgContainer
                    : styles.receiverMsgContainer
                }
              >
                <Text style={styles.time}>{msg.time}</Text>
                <View
                  style={
                    msg.type === "sender"
                      ? styles.senderMsg
                      : styles.receiverMsg
                  }
                >
                  <Text
                    style={
                      msg.type === "sender"
                        ? styles.msgText
                        : [styles.msgText, { color: "#fff" }]
                    }
                  >
                    {msg.message}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputX}>
            <TextInput
              style={styles.input}
              placeholder="Type a message here"
              onChangeText={setMessageText}
              value={messageText}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  goBack: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerLeftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    marginLeft: 10,
  },
  headerRightSide: {
    marginRight: 20,
    justifyContent: "center",
  },
  iconRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f6eef6",
    alignItems: "center",
    justifyContent: "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    justifyContent: "flex-end",
  },
  inputContainer: {
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
  },
  inputX: {
    width: "95%",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "90%",
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
  },
  senderMsgContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  receiverMsgContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  senderMsg: {
    padding: 15,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    borderBottomStartRadius: 16,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    marginBottom: 15,
    maxWidth: "70%",
  },
  receiverMsg: {
    padding: 15,
    borderTopEndRadius: 16,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    backgroundColor: "#884e7e",
    opacity: 0.8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    marginBottom: 15,
    maxWidth: "70%",
  },
  msgText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    marginBottom: 5,
    color: "#A3A3A3",
  },
});
