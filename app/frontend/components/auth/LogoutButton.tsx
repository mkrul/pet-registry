// src/components/auth/LogoutButton.tsx

import React from "react";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";

const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      // Redirect to login if needed
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
