import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    createFilter(state, action) {
      return action.payload
    }
  }
  })

export default filterSlice.reducer
export const { createFilter } = filterSlice.actions 