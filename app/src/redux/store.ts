import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./features/auth/authApiSlice";
import authReducer from "./features/auth/authSlice";
import reportsReducer from "./features/reports/reportsSlice";
import reportsApi from "./features/reports/reportsApi";
import searchReducer from "./features/search/searchSlice";
import notificationsReducer from "./features/notifications/notificationsSlice";
import loadingReducer from "./features/loading/loadingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    reports: reportsReducer,
    search: searchReducer,
    notifications: notificationsReducer,
    loading: loadingReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApiSlice.middleware).concat(reportsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
