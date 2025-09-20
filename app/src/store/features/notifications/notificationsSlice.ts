import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "../../../../../shared/types/common/Notification";

const initialState: { notification: NotificationState | null } = {
  notification: null
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationState | null>) => {
      state.notification = action.payload;
    }
  }
});

export const { setNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
