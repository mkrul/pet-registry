import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import { useGetCurrentUserQuery } from "./redux/features/auth/authApiSlice";
import { useAppDispatch } from "./redux/hooks";
import { setUser } from "./redux/features/auth/authSlice";
import AppRouter from "./components/common/AppRouter";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: authData, isLoading } = useGetCurrentUserQuery(undefined, {
    pollingInterval: 900000, // Poll every 15 minutes
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    console.debug("Auth data changed:", authData);
    if (authData?.user) {
      console.debug("Restoring user session from server");
      dispatch(setUser(authData.user));
    }
  }, [authData, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <AppRouter />
    </Router>
  );
};

export default App;
