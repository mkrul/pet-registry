import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "./redux/features/auth/authApiSlice";
import AppRouter from "./components/common/AppRouter";
import { useAppDispatch } from "./redux/hooks";
import { setUser, clearUser } from "./redux/features/auth/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined, {
    // Only refetch on mount or if 1 hour has passed
    pollingInterval: 3600000,
    refetchOnMountOrArgChange: 3600,
    // Add retry logic for failed requests
    retryOn: (err: any) => {
      console.log("Retry check:", err);
      // Only retry on network errors, not auth errors
      return err.status !== 401 && err.status !== 403;
    }
  });

  useEffect(() => {
    console.log("Auth state check:", { data, isError, error });

    if (data?.user) {
      console.log("Setting authenticated user:", data.user);
      dispatch(setUser(data.user));
    } else if (isError) {
      console.log("Clearing user due to error:", error);
      dispatch(clearUser());
    }
  }, [data, isError, error, dispatch]);

  if (isLoading) {
    console.log("Loading auth state...");
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
