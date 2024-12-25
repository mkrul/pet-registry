import React from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";

interface LogoutButtonProps {
  onCompleted: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onCompleted }) => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      onCompleted();
    } catch (err: unknown) {
      // Still dispatch clearUser on error to ensure user is logged out locally
      dispatch(clearUser());
      onCompleted();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
