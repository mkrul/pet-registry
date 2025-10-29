import React, { useEffect, useState } from "react";

const calculateDuration = (message) => {
  const baseTime = 3000;
  const charTime = 50;
  const messageLength = message ? message.length : 0;
  return Math.min(baseTime + (messageLength * charTime), 10000);
};

const ToastNotification = ({ id, type, message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  if (!message) {
    return null;
  }

  const typeStyles = {
    "SUCCESS": "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300",
    "WARNING": "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300",
    "ERROR": "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300",
    "INFO": "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
  };

  useEffect(() => {
    const enterTimeout = setTimeout(() => {
      setIsEntering(false);
    }, 600);

    const duration = calculateDuration(message);
    const dismissTimeout = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(dismissTimeout);
    };
  }, [message]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 400);
  };

  const getAnimationClass = () => {
    if (isExiting) return "animate-slideUpBounce";
    if (isEntering) return "animate-slideDownBounce";
    return "";
  };

  return (
    <div
      className={`${typeStyles[type]} border-l-4 px-6 py-4 rounded-r-lg shadow-lg flex justify-between items-center min-w-[320px] max-w-md ${getAnimationClass()}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onClick={handleDismiss}
      style={{ cursor: "pointer" }}
    >
      <span className="block text-base font-normal pr-4">{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <span className="text-2xl leading-none" aria-hidden="true">
          &times;
        </span>
      </button>
    </div>
  );
};

export default ToastNotification;

