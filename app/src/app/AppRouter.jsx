import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "../shared/components/common/Navbar.jsx";
import ReportIndexPage from "../features/listings/pages/ListingsIndexView.jsx";
import ListingShowView from "../features/listings/pages/ListingShowView.jsx";
import DashboardView from "../features/dashboard/pages/DashboardView.jsx";
import Footer from "../shared/components/common/Footer.jsx";
import PrivateRoute from "../shared/components/common/PrivateRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import SignUpPage from "../features/auth/pages/SignUpPage.jsx";
import AboutPage from "../features/about/pages/AboutPage.jsx";
import { useAppSelector } from "../store/hooks.js";
import ToastManager from "../shared/components/common/ToastManager.jsx";
import ComponentLoader from "../shared/components/common/ComponentLoader.jsx";
import ScrollToTop from "../shared/components/common/ScrollToTop.jsx";
import { useMemo } from "react";

const AppRouter = () => {
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();


  const routesComponent = useMemo(
    () => (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUpPage />} />
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reports/:id" element={<ListingShowView />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardView />}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={null} />
            <Route path="reports" element={null} />
            <Route path="pets" element={null} />
            <Route path="profile" element={null} />
            <Route path="settings" element={null} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    ),
    [user]
  );

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <ScrollToTop />
      <ToastManager />
      <NavBar />
      <div className="flex-grow bg-page">
        <ComponentLoader>{routesComponent}</ComponentLoader>
      </div>
      <Footer />
    </div>
  );
};

export default AppRouter;
