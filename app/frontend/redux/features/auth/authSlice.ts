// src/redux/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice';

interface User {
  id: number;
  email: string;
  name: string;
  image: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApiSlice.endpoints.googleLogin.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApiSlice.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      }
    );
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
