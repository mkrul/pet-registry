import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./features/auth/authApiSlice";
import authReducer from "./features/auth/authSlice";
import reportsReducer from "./features/reports/reportsSlice";
import reportsApi from "./features/reports/reportsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    reports: reportsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApiSlice.middleware).concat(reportsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
