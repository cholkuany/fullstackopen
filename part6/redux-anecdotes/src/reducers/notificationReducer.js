import { createSlice } from "@reduxjs/toolkit";

let timeOutId = null;

const messageSlice = createSlice({
  name: "message",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

export default messageSlice.reducer;
export const { setNotification, clearNotification } = messageSlice.actions;

export const setNotificationWithTimeout = (message, time = 5000) => {
  return dispatch => {
    // Clear any existing timeout
    if (timeOutId) {
      clearTimeout(timeOutId);
      timeOutId = null;
    }

    dispatch(setNotification(message));

    timeOutId = setTimeout(() => {
      dispatch(clearNotification());
      timeOutId = null;
    }, time);
  };
};