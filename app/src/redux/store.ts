import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./features/reports/reportsSlice";
import authReducer from "./features/auth/authSlice";
import reportsApi from "./features/reports/reportsApi";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    [reportsApi.reducerPath]: reportsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    reports: reportsReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(reportsApi.middleware).concat(authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
