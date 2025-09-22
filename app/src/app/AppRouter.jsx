import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "../shared/components/common/Navbar.jsx";
import ReportIndexPage from "../features/reports/pages/ReportsIndexPage.jsx";
import ReportShowPage from "../features/reports/pages/ReportShowPage.jsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import Footer from "../shared/components/common/Footer.jsx";
import PrivateRoute from "../shared/components/common/PrivateRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import SignUpPage from "../features/auth/pages/SignUpPage.jsx";
import { useAppSelector, useAppDispatch } from "../store/hooks.js";
import Notification from "../shared/components/common/Notification.jsx";
import { setNotification } from "../store/features/notifications/notificationsSlice.js";
import ComponentLoader from "../shared/components/common/ComponentLoader.jsx";
import { useMemo, useEffect } from "react";

const AppRouter = () => {
  console.log("🛣️ AppRouter: Component rendering");
  const user = useAppSelector(state => state.auth.user);
  const notification = useAppSelector(state => state.notifications.notification);
  const dispatch = useAppDispatch();
  const location = useLocation();

  console.log("👤 AppRouter: User state:", user);
  console.log("📍 AppRouter: Current location:", location.pathname);

  const isDashboardPage = location.pathname === '/dashboard';


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
      {notification && !isDashboardPage && (
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
