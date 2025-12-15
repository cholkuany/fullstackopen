import { createSlice } from "@reduxjs/toolkit";

let timeOutID = null;

const notificationSlice = createSlice({
  name: "notification",
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

const { setNotification, clearNotification } = notificationSlice.actions;

export const setNotificationMessage = (message) => {
  return async (dispatch) => {
    if (timeOutID) {
      clearTimeout(timeOutID);
    }
    dispatch(setNotification(message));
    timeOutID = setTimeout(() => {
      dispatch(clearNotification());
      timeOutID = null;
    }, 5000);
  };
};
export default notificationSlice.reducer;
