import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";
import Spinner from "../common/Spinner";

const PrivateRoute: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();

  const { isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
    refetchOnMountOrArgChange: 3600
  });

  console.log('PrivateRoute - user:', !!user, 'isLoading:', isLoading, 'location:', location.pathname);

  if (isLoading && !user) {
    console.log('PrivateRoute - showing global spinner');
    return <Spinner />;
  }

  if (!user || error) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
