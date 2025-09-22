import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks.js";
import { useGetCurrentUserQuery } from "../../../store/features/auth/authApiSlice.js";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();

  const { isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
    refetchOnMountOrArgChange: 3600
  });


  if (isLoading && !user) {
    return <Spinner />;
  }

  if (!user || error) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
