import React, { useEffect } from "react";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import {
  setUser,
  clearUser,
  setAuthLoading,
  checkAuthTimeout
} from "../../redux/features/auth/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  // Fetch current user with polling enabled
  const { data, isLoading } = useGetCurrentUserQuery(undefined, {
    // Poll every 5 minutes to keep session alive
    pollingInterval: 5 * 60 * 1000
  });

  // Initial auth check and periodic updates
  useEffect(() => {
    if (!isLoading) {
      if (data?.user) {
        dispatch(setUser(data.user));
      } else {
        dispatch(clearUser());
      }
    } else {
      dispatch(setAuthLoading());
    }
  }, [data, isLoading, dispatch]);

  // Check auth timeout periodically
  useEffect(() => {
    const checkTimeout = () => {
      dispatch(checkAuthTimeout());
    };

    // Check every minute
    const interval = setInterval(checkTimeout, 60 * 1000);

    // Check when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTimeout();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial check
    checkTimeout();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);

  // Render children without additional wrapper to avoid unnecessary DOM nesting
  return <>{children}</>;
};

export default AuthProvider;
