import { createSlice } from "@reduxjs/toolkit";

import usersService from "../services/users";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    getUsers(state, action) {
      return action.payload;
    },
  },
});

export default usersSlice.reducer;
const { getUsers } = usersSlice.actions;

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      const users = await usersService.getAll();
      dispatch(getUsers(users));
    } catch (error) {
      console.log(error);
      dispatch(getUsers([]));
    }
  };
};
