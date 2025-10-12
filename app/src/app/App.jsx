import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/features/auth/authApiSlice.js";
import AppRouter from "./AppRouter.jsx";
import { useAppDispatch } from "../store/hooks.js";
import { setUser, clearUser } from "../store/features/auth/authSlice.js";
import { setComponentsLoading } from "../store/features/loading/loadingSlice.js";
const App = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined, {
    pollingInterval: 900000,
    refetchOnMountOrArgChange: false
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError && error) {
      dispatch(clearUser());
    }

    if (!isLoading) {
      dispatch(setComponentsLoading(false));
    }
  }, [data, isError, error, isLoading, dispatch]);

  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
