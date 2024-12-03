import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const PrivateRoute: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
