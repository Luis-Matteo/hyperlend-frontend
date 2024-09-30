import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
