// src/components/common/PrivateRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const PrivateRoute: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
