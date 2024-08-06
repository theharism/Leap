import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: { "__v": 0, "_id": "66b1324dda044618d4856739", "email": "chharis9999@gmail.com", "fullName": "Muhammad Haris", "role": "agent", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmIxMzI0ZGRhMDQ0NjE4ZDQ4NTY3MzkiLCJpYXQiOjE3MjI4ODg3ODEsImV4cCI6MTcyMzQ5MzU4MX0.821AHJmCp5VDM_1CpF8o4BeZDBbf5dE51PVozKsfHHE" },
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
