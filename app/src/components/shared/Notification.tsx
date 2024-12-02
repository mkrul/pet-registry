// Notification.tsx
import React from "react";

interface NotificationProps {
  type: "success" | "warning" | "danger";
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    danger: "bg-red-100 border-red-400 text-red-700"
  };

  return (
    <div className={`${typeStyles[type]} border px-4 py-3 rounded relative mb-4`}>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Notification;
