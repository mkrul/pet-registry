import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../store/features/notifications/notificationsSlice.js";
import Spinner from "./Spinner";

export const MapContainer = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const showNotification = (notification) => {
    dispatch(addNotification(notification));
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        {children(showNotification)}
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
            <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};
