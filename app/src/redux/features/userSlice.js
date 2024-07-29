import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload.user;

      async function write() {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }
      write();
      return user;
    },
    logoutUser: (state, action) => {
      async function logout() {
        await AsyncStorage.removeItem("user");
      }
      logout();
      return null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
