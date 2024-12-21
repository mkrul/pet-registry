import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";
import Spinner from "../shared/Spinner";

const PrivateRoute: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();

  const { isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
    refetchOnMountOrArgChange: 3600
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
