import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: null,
  notifications: []
};

let notificationIdCounter = 0;

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        ...action.payload,
        id: ++notificationIdCounter
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { setNotification, addNotification, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
