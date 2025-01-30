import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "../../../types/common/Notification";

const initialState: { notification: NotificationState | null } = {
  notification: null
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationState | null>) => {
      console.log("Setting notification state:", {
        currentState: state.notification,
        newState: action.payload,
        hasChanged: state.notification !== action.payload
      });
      state.notification = action.payload;
    }
  }
});

export const { setNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
