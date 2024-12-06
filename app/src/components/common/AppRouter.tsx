import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../shared/Navbar";
import ReportIndexPage from "../../pages/reports/ReportsIndexPage";
import ReportNewPage from "../../pages/reports/ReportNewPage";
import ReportShowPage from "../../pages/reports/ReportShowPage";
import Footer from "../shared/Footer";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../../pages/auth/LoginPage";
import ScrollToTop from "./ScrollToTop";
import SignUpPage from "../../pages/auth/SignUpPage";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/reports/new" element={<ReportNewPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
