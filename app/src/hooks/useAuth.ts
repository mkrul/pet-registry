import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useGetCurrentUserQuery } from "../redux/features/auth/authApiSlice";
import { setUser, clearUser, setAuthLoading } from "../redux/features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    data: currentUser,
    isLoading: isCheckingAuth,
    error: authError
  } = useGetCurrentUserQuery(undefined, {
    // Polling every 5 minutes to keep the session alive
    pollingInterval: 5 * 60 * 1000
  });

  useEffect(() => {
    if (!isCheckingAuth) {
      if (currentUser) {
        dispatch(setUser(currentUser));
      } else {
        dispatch(clearUser());
      }
    } else {
      dispatch(setAuthLoading());
    }
  }, [currentUser, isCheckingAuth, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth,
    error: error || (authError ? "Authentication failed" : null)
  };
};
