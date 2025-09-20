import React from "react";
import { useLogoutMutation } from "../../../store/features/auth/authApiSlice";
import { useAppDispatch } from "../../../store/hooks";
import { clearUser } from "../../../store/features/auth/authSlice";
import NavLink from "../../../shared/components/common/NavLink";
import { LogoutButtonProps } from "../types/LogoutButton";

const LogoutButton: React.FC<LogoutButtonProps> = ({ onCompleted, className = "" }) => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
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
