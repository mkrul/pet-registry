import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "./redux/features/auth/authApiSlice";
import AppRouter from "./components/main/AppRouter";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setUser, clearUser } from "./redux/features/auth/authSlice";
import { setComponentsLoading } from "./redux/features/loading/loadingSlice";
import Spinner from "./components/common/Spinner";
import Notification from "./components/common/Notification";
import { setNotification } from "./redux/features/notifications/notificationsSlice";
import { NotificationType } from "./types/common/Notification";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(state => {
    console.log("App: Selecting notification state:", state.notifications);
    return state.notifications.notification;
  });

  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined, {
    pollingInterval: 900000,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError) {
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
        {notification && (
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
      {notification && (
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
