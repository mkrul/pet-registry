import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  lastAction: null
};

const lastActionSlice = createSlice({
  name: "lastAction",
  initialState,
  reducers: {
    setLastAction: (state, action: PayloadAction<any>) => {
      state.lastAction = action.payload;
    }
  }
});

export const { setLastAction } = lastActionSlice.actions;
export default lastActionSlice.reducer;
