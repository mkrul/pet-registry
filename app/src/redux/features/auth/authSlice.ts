import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../../types/User";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: number | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  lastChecked: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.lastChecked = Date.now();
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastChecked = Date.now();
    },
    setAuthLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isAuthenticated = false;
    },
    checkAuthTimeout(state) {
      const THIRTY_MINUTES = 30 * 60 * 1000;
      if (state.lastChecked && Date.now() - state.lastChecked > THIRTY_MINUTES) {
        state.isLoading = true;
        state.error = null;
      }
    }
  }
});

export const { setUser, clearUser, setAuthLoading, setAuthError, checkAuthTimeout } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
