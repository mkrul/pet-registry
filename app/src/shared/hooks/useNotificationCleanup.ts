import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../../store/features/notifications/notificationsSlice";

export const useNotificationCleanup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setNotification(null));
    };
  }, [dispatch]);
};
