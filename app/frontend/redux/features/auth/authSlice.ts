// src/redux/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice';

interface User {
  id: number;
  email: string;
  name: string;
  image: string;
  // Add other user fields as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.googleLogin.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.googleLogin.matchRejected,
        (state, { error }) => {
          state.error = error?.data?.message || 'Google login failed.';
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchFulfilled,
        (state, { payload }) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchRejected,
        (state, { error }) => {
          state.error = error?.data?.message || 'Logout failed.';
        }
      );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
