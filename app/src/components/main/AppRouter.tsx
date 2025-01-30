import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../common/Navbar";
import ReportIndexPage from "../../pages/reports/ReportsIndexPage";
import ReportNewPage from "../../pages/reports/ReportNewPage";
import ReportShowPage from "../../pages/reports/ReportShowPage";
import Footer from "../common/Footer";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../../pages/auth/LoginPage";
import SignUpPage from "../../pages/auth/SignUpPage";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Notification from "../common/Notification";
import { setNotification } from "../../redux/features/notifications/notificationsSlice";

const AppRouter = () => {
  const user = useAppSelector(state => state.auth.user);
  const notification = useAppSelector(state => state.notifications.notification);
  const dispatch = useAppDispatch();

  return (
    <div>
      <NavBar />
      {notification && (
        <div className="fixed top-20 right-4 z-50">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => dispatch(setNotification(null))}
          />
        </div>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUpPage />} />
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/reports/new" element={<ReportNewPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
