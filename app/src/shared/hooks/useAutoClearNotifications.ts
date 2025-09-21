import { useEffect } from 'react';

export const useClearNotificationsOnUnmount = (setNotification) => {
  useEffect(() => {
    return () => {
      setNotification(null);
    };
  }, [setNotification]);
};
