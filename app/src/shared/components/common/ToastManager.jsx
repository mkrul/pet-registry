import React from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks.js";
import { removeNotification } from "../../../store/features/notifications/notificationsSlice.js";
import ToastNotification from "./ToastNotification.jsx";

const ToastManager = () => {
  const notifications = useAppSelector(state => state.notifications.notifications);
  const dispatch = useAppDispatch();

  const handleDismiss = (id) => {
    dispatch(removeNotification(id));
  };

  const currentNotification = notifications.length > 0 ? notifications[0] : null;

  if (!currentNotification) {
    return null;
  }

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[9999] pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      <div className="pointer-events-auto">
        <ToastNotification
          key={currentNotification.id}
          id={currentNotification.id}
          type={currentNotification.type}
          message={currentNotification.message}
          onDismiss={handleDismiss}
        />
      </div>
    </div>
  );
};

export default ToastManager;

