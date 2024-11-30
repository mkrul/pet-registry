// src/AppRouter.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/shared/Navbar";
import ReportIndexPage from "./pages/reports/ReportsIndexPage";
import ReportNewPage from "./pages/reports/ReportNewPage";
import ReportShowPage from "./pages/reports/ReportShowPage";
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import OAuthHandler from "./components/auth/OAuthHandler";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<OAuthHandler />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/reports/new" element={<ReportNewPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
