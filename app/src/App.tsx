import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGetCurrentUserQuery } from "./redux/features/auth/authApiSlice";
import AppRouter from "./components/main/AppRouter";
import { useAppDispatch } from "./redux/hooks";
import { setUser, clearUser } from "./redux/features/auth/authSlice";
import Spinner from "./components/common/Spinner";
import Notification from "./components/common/Notification";
import { NotificationState, NotificationType } from "./types/common/Notification";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, isLoading, isError, error } = useGetCurrentUserQuery(undefined, {
    pollingInterval: 3600000,
    refetchOnMountOrArgChange: 3600
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (isError) {
      dispatch(clearUser());
      if ("data" in error) {
        setNotification({
          type: NotificationType.ERROR,
          message: (error.data as any)?.message || "Authentication error occurred"
        });
      }
    }
  }, [data, isError, error, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Router>
      {notification && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <AppRouter />
    </Router>
  );
};

export default App;
