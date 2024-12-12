import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";

const PrivateRoute: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();

  // Only fetch current user if we don't have a user in state
  const { isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !!user, // Skip if we already have a user
    refetchOnMountOrArgChange: 3600 // Only refetch after 1 hour
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
