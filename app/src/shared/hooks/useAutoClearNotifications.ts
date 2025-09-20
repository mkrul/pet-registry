import { useEffect } from 'react';
import { NotificationState } from '../types/common/Notification';

export const useClearNotificationsOnUnmount = (setNotification: (notification: NotificationState | null) => void) => {
  useEffect(() => {
    return () => {
      setNotification(null);
    };
  }, [setNotification]);
};
