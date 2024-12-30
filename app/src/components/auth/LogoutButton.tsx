import React from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";
import NavLink from "../shared/NavLink";

interface LogoutButtonProps {
  onCompleted: () => void;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onCompleted, className = "" }) => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      onCompleted();
    } catch (err: unknown) {
      dispatch(clearUser());
      onCompleted();
    }
  };

  return (
    <NavLink handler={handleLogout} className={className}>
      Logout
    </NavLink>
  );
};

export default LogoutButton;
