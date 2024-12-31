// Notification.tsx
import React from "react";
import { NotificationType, NotificationProps } from "../../types/common/Notification";

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const typeStyles: Record<NotificationType, string> = {
    [NotificationType.SUCCESS]: "bg-green-100 border-green-400 text-green-700",
    [NotificationType.WARNING]: "bg-yellow-100 border-yellow-400 text-yellow-700",
    [NotificationType.ERROR]: "bg-red-100 border-red-400 text-red-700",
    [NotificationType.INFO]: "bg-blue-100 border-blue-400 text-blue-700"
  };

  const defaultMessages = {
    [NotificationType.SUCCESS]: "The operation has completed successfully.",
    [NotificationType.ERROR]: "An unexpected error has occurred.",
    [NotificationType.WARNING]: "",
    [NotificationType.INFO]: ""
  };

  return (
    <div
      className={`${typeStyles[type]} border px-4 py-3 rounded relative mb-4 flex justify-between items-center`}
      role="alert"
    >
      <span className="block sm:inline">{message || defaultMessages[type]}</span>
      <button onClick={onClose} className="ml-4" aria-label="Close">
        <span className="text-xl" aria-hidden="true">
          &times;
        </span>
      </button>
    </div>
  );
};

export default Notification;
