import { configureStore } from "@reduxjs/toolkit";
import { rootApiSlice } from "./features/rootApiSlice";
import reportsSlice from "./features/reports/reportsSlice";
import reportsApi from "./features/reports/reportsApi";

export const store = configureStore({
  reducer: {
    reports: reportsSlice,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [rootApiSlice.reducerPath]: rootApiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApiSlice.middleware, reportsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
