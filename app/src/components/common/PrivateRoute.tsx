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

  console.log("PrivateRoute check:", { user, isLoading, error });

  if (isLoading) {
    console.log("PrivateRoute: Loading auth state...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("PrivateRoute: No authenticated user, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log("PrivateRoute: User authenticated, rendering protected content");
  return <Outlet />;
};

export default PrivateRoute;
