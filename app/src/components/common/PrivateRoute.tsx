import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const PrivateRoute = () => {
  const user = useAppSelector(state => state.auth.user);

  if (!user) {
    console.debug("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.debug("User authenticated, rendering protected route");
  return <Outlet />;
};

export default PrivateRoute;
