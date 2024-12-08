import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./features/reports/reportsSlice";
import reportsApi from "./features/reports/reportsApi";

export const store = configureStore({
  reducer: {
    [reportsApi.reducerPath]: reportsApi.reducer,
    reports: reportsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
