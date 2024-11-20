// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { rootApiSlice } from './features/rootApiSlice';
import reportsSlice from './features/reports/reportsSlice';
import reportsApi from './features/reports/reportsApi';
import { authApiSlice } from './features/auth/authApiSlice';
import authReducer, { setCredentials } from './features/auth/authSlice';

// Function to load token from localStorage
const loadToken = () => {
  try {
    const serializedToken = localStorage.getItem('token');
    if (serializedToken === null) {
      return undefined;
    }
    return serializedToken;
  } catch (err) {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    reports: reportsSlice,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [rootApiSlice.reducerPath]: rootApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rootApiSlice.middleware,
      reportsApi.middleware,
      authApiSlice.middleware
    ),
});

// Hydrate the auth state from localStorage if token exists
const token = loadToken();
if (token) {
  // Optionally, you might want to fetch user details from the backend
  store.dispatch(setCredentials({ user: null, token }));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
