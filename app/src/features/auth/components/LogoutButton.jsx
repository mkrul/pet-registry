import React from "react";
import { useLogoutMutation } from "../../../store/features/auth/authApiSlice.js";
import { useAppDispatch } from "../../../store/hooks.js";
import { clearUser } from "../../../store/features/auth/authSlice.js";
import NavLink from "../../../shared/components/common/NavLink.jsx";

const LogoutButton = ({ onCompleted, className = "" }) => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(clearUser());
      onCompleted();
    } catch (err) {
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
