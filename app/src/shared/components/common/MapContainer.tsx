import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Notification from "./Notification";
import { NotificationMessage } from "../../types/common/Notification";

interface MapContainerProps {
  children: (
    setNotification: (notification: NotificationMessage | null) => void
  ) => React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-2">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        {children(setNotification)}
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
            <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};
