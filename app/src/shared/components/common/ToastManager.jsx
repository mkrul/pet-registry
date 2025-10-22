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
    <>
      {/* Screen reader announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="status"
        key={currentNotification.id}
      >
        {currentNotification && (
          <span>
            {currentNotification.type === "SUCCESS" && "Success: "}
            {currentNotification.type === "ERROR" && "Error: "}
            {currentNotification.type === "WARNING" && "Warning: "}
            {currentNotification.type === "INFO" && "Info: "}
            {currentNotification.message}
          </span>
        )}
      </div>

      {/* Visual toast notifications */}
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
    </>
  );
};

export default ToastManager;

