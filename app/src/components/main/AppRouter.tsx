import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../common/Navbar";
import ReportIndexPage from "../../pages/reports/ReportsIndexPage";
import ReportNewPage from "../../pages/reports/ReportNewPage";
import ReportShowPage from "../../pages/reports/ReportShowPage";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import Footer from "../common/Footer";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../../pages/auth/LoginPage";
import SignUpPage from "../../pages/auth/SignUpPage";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Notification from "../common/Notification";
import { setNotification } from "../../redux/features/notifications/notificationsSlice";
import ComponentLoader from "../common/ComponentLoader";
import { useMemo } from "react";

const AppRouter = () => {
  const user = useAppSelector(state => state.auth.user);
  const notification = useAppSelector(state => state.notifications.notification);
  const dispatch = useAppDispatch();

  const routesComponent = useMemo(
    () => (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUpPage />} />
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/reports/new" element={<ReportNewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    ),
    [user]
  );

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <NavBar />
      {notification && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl mx-4 mt-4">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => dispatch(setNotification(null))}
            />
          </div>
        </div>
      )}
      <div className="flex-grow bg-page">
        <ComponentLoader>{routesComponent}</ComponentLoader>
      </div>
      <Footer />
    </div>
  );
};

export default AppRouter;
