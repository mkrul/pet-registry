import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice";
import { IUser } from "../../../types/User";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    }
  },
  extraReducers: builder => {
    builder.addMatcher(authApiSlice.endpoints.logout.matchFulfilled, state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
