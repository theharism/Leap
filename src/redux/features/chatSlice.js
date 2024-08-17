import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "Chat",
    initialState: {
        messages: [],
        unread: 0
    },
    reducers: {
        addMessage: (state, action) => {
            // const newMessages = [...state.messages, action.payload]
            state.messages.push(action.payload.message)
            state.unread += action.payload?.unread || 0
            async function write() {
                await AsyncStorage.setItem("chat", JSON.stringify(state))
            }
            write()
            return state;
        },
        setChat: (state, action) => {
            async function write() {
                await AsyncStorage.setItem("chat", JSON.stringify(action.payload))
            }
            write()
            return action.payload;
        },
        resetUnread: (state, action) => {
            state.unread = 0
            return state
        },
        resetChat: (state, action) => {
            async function reset() {
                await AsyncStorage.removeItem("chat")
            }
            reset();
            return {
                messages: [],
                unread: 0
            }
        }
    },
});

export const { addMessage, setChat, resetChat, resetUnread } = chatSlice.actions;

export default chatSlice.reducer;
