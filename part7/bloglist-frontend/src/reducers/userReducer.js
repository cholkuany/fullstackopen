import { createSlice } from "@reduxjs/toolkit";

import loginService from "../services/login";
import createService from "../services/create";

import { setNotificationMessage } from "./notificationReducer";
import { setStatus } from "./statusReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    signIn(state, action) {
      return action.payload;
    },
    signOut() {
      return null;
    },
  },
});

export default userSlice.reducer;
const { signIn, signOut } = userSlice.actions;

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      console.log("USER login;;;", user);
      if (user) {
        window.localStorage.setItem("loggedInUser", JSON.stringify(user));
        dispatch(signIn(user));
        createService.setToken(user.token);
        dispatch(setNotificationMessage("✅ You are logged in!"));
        dispatch(setStatus("success"));
      }
    } catch (error) {
      dispatch(setNotificationMessage("❌ Login failed."));
      dispatch(setStatus("error"));
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedInUser");
    createService.setToken(null);
    dispatch(signOut());

    dispatch(setNotificationMessage("🔒 You are logged out!"));
    dispatch(setStatus("success"));
  };
};

export const initializeCurrentUser = () => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(window.localStorage.getItem("loggedInUser"));
      if (user) {
        createService.setToken(user.token);
        dispatch(signIn(user));
      }
    } catch {
      window.localStorage.removeItem("loggedInUser");
    }
  };
};
