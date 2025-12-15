import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
  name: "status",
  initialState: "",
  reducers: {
    setStatus(state, action) {
      return action.payload;
    },
  },
});

export default statusSlice.reducer;
export const { setStatus } = statusSlice.actions;
