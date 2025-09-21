import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/features/auth/authApiSlice";
import AppRouter from "./AppRouter";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, clearUser } from "../store/features/auth/authSlice";
import { setComponentsLoading } from "../store/features/loading/loadingSlice";
import Spinner from "../shared/components/common/Spinner";
import Notification from "../shared/components/common/Notification";
import { setNotification } from "../store/features/notifications/notificationsSlice";
import { NotificationType } from "../shared/types/common/Notification";

const App: React.FC = () => {
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
            type: NotificationType.ERROR,
            message: (error.data as any)?.error
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
