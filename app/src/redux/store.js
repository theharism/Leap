import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import entriesSlice from "./features/entriesSlice";

export const store = configureStore({
  reducer: {
    User: userReducer,
    Entries: entriesSlice
  },
});
