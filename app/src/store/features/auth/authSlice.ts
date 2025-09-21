import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProps } from "../../../shared/types/User";

interface AuthState {
  user: UserProps | null;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  lastActivity: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProps>) {
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateLastActivity(state) {
      state.lastActivity = Date.now();
    }
  }
});

export const { setUser, clearUser, setLoading, setError, updateLastActivity } = authSlice.actions;
export default authSlice.reducer;
