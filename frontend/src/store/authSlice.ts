import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// TODO: Get the current expirationTime and set it again if there is not any other remember option


const initialState = (() => {
  const userInfo = Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo") || 'null')
    : null;
  const expirationTime = Cookies.get("expirationTime")
    ? JSON.parse(Cookies.get("expirationTime") || 'null')
    : null;

  // Check if the expirationTime is less than the current time
  if (expirationTime) {
    const expirationDate = new Date(expirationTime);
    if (new Date().getTime() > expirationDate.getTime()) {
      Cookies.remove("userInfo");
      Cookies.remove("expirationTime");
      return {
        userInfo: null,
        expirationTime: null,
      };
    }
  }

  return {
    userInfo,
    expirationTime,
  };
})();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const duration = action.payload.remember ? 30 : 1;
      const expirationTime =
        new Date().getTime() + 24 * 60 * 60 * 1000 * duration;
      state.userInfo = action.payload.user;
      state.expirationTime = expirationTime;
      Cookies.set("userInfo", JSON.stringify(action.payload.user));
      Cookies.set("expirationTime", expirationTime.toString());
    },
    removeCredentials: (state) => {
      state.userInfo = null;
      Cookies.remove("userInfo");
      Cookies.remove("expirationTime");
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export default authSlice.reducer;
