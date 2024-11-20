// src/AppRouter.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/shared/Navbar";
import ReportIndexPage from "./pages/reports/ReportsIndexPage";
import ReportNewPage from "./pages/reports/ReportNewPage";
import ReportShowPage from "./pages/reports/ReportShowPage";
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ReportIndexPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/reports/new" element={<ReportNewPage />} />
          <Route path="/reports/:id" element={<ReportShowPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
