import React, { useState } from "react";

const Notification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const typeStyles = {
    "SUCCESS": "bg-green-100 border-green-400 text-green-700",
    "WARNING": "bg-yellow-100 border-yellow-400 text-yellow-700",
    "ERROR": "bg-red-100 border-red-400 text-red-700",
    "INFO": "bg-blue-100 border-blue-400 text-blue-700"
  };

  return (
    <div
      className={`${typeStyles[type]} border px-4 py-3 rounded relative mb-4 flex justify-between items-center
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      role="alert"
    >
      <span className="block text-base font-normal sm:inline">{message}</span>
      <button onClick={handleClose} className="ml-4" aria-label="Close">
        <span className="text-xl" aria-hidden="true">
          &times;
        </span>
      </button>
    </div>
  );
};

const defaultMessages = {
  "SUCCESS": "The operation has completed successfully.",
  "ERROR": "An unexpected error has occurred.",
  "WARNING": "",
  "INFO": ""
};

export default Notification;
