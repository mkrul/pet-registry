// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { authApiSlice } from './features/auth/authApiSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
