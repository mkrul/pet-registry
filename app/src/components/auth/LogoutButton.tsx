import React, { useState } from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";
import { NotificationState, NotificationType } from "../../types/Notification";
import { Errors } from "../../types/ErrorMessages";

const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      setNotification({
        type: NotificationType.SUCCESS,
        message: response.message
      });
      dispatch(clearUser());
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || Errors.LOGOUT_FAILED
      });
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
