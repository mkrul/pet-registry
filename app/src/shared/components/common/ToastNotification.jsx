import React, { useEffect, useState } from "react";

const calculateDuration = (message) => {
  const baseTime = 3000;
  const charTime = 50;
  return Math.min(baseTime + (message.length * charTime), 10000);
};

const ToastNotification = ({ id, type, message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  const typeStyles = {
    "SUCCESS": "bg-green-100 border-green-400 text-green-700",
    "WARNING": "bg-yellow-100 border-yellow-400 text-yellow-700",
    "ERROR": "bg-red-100 border-red-400 text-red-700",
    "INFO": "bg-blue-100 border-blue-400 text-blue-700"
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

