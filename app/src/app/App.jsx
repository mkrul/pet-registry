import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/features/auth/authApiSlice.js";
import AppRouter from "./AppRouter.jsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { setUser, clearUser } from "../store/features/auth/authSlice.js";
import { setComponentsLoading } from "../store/features/loading/loadingSlice.js";
import Spinner from "../shared/components/common/Spinner.jsx";
import Notification from "../shared/components/common/Notification.jsx";
import { setNotification } from "../store/features/notifications/notificationsSlice.js";
const App = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(state => {
    return state.notifications.notification;
  });

  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined, {
    pollingInterval: 900000,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError && error) {
      dispatch(clearUser());
      if ("data" in error) {
        dispatch(
          setNotification({
            type: "ERROR",
            message: error.data?.error
          })
        );
      }
    }

    // Set components as loaded once auth query is complete (success or error)
    if (!isLoading) {
      dispatch(setComponentsLoading(false));
    }
  }, [data, isError, error, isLoading, dispatch]);

  if (isLoading) {
    return (
      <>
        {notification && notification.message && (
          <div className="fixed top-4 right-4 z-50 w-96">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => dispatch(setNotification(null))}
            />
          </div>
        )}
        <Spinner />
      </>
    );
  }

  return (
    <>
      {notification && notification.message && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => dispatch(setNotification(null))}
          />
        </div>
      )}
      <Router>
        <AppRouter />
      </Router>
    </>
  );
};

export default App;
