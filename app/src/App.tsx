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
    refetchOnMountOrArgChange: 3600
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [data, isError, error, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
