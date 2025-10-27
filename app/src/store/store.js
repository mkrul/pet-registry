import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./features/auth/authApiSlice.js";
import authReducer from "./features/auth/authSlice.js";
import reportsReducer from "./features/reports/reportsSlice.js";
import reportsApi from "./features/reports/reportsApi.js";
import petsReducer from "./features/pets/petsSlice.js";
import petsApi from "./features/pets/petsApi.js";
import { tipsApi } from "./features/tips/tipsApi.js";
import { eventsApi } from "./features/events/eventsApi.js";
import searchReducer from "./features/search/searchSlice.js";
import notificationsReducer from "./features/notifications/notificationsSlice.js";
import loadingReducer from "./features/loading/loadingSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [petsApi.reducerPath]: petsApi.reducer,
    [tipsApi.reducerPath]: tipsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    reports: reportsReducer,
    pets: petsReducer,
    search: searchReducer,
    notifications: notificationsReducer,
    loading: loadingReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApiSlice.middleware).concat(reportsApi.middleware).concat(petsApi.middleware).concat(tipsApi.middleware).concat(eventsApi.middleware)
});

