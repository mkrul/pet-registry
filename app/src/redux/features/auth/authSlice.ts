import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProps } from "../../../types/User";
import { AuthState } from "../../../types/auth/AuthState";

const initialState: AuthState = {
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProps>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
