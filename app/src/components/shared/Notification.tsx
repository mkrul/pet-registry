// Notification.tsx
import React from "react";
import { NotificationType } from "../../types/Notification";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700"
  };

  return (
    <div
      className={`${typeStyles[type]} border px-4 py-3 rounded relative mb-4 flex justify-between items-center`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button onClick={onClose} className="ml-4" aria-label="Close">
        <span className="text-xl" aria-hidden="true">
          &times;
        </span>
      </button>
    </div>
  );
};

export default Notification;
