import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../shared/Navbar";
import ReportIndexPage from "../../pages/reports/ReportsIndexPage";
import ReportNewPage from "../../pages/reports/ReportNewPage";
import ReportShowPage from "../../pages/reports/ReportShowPage";
import Footer from "../shared/Footer";
import ScrollToTop from "./ScrollToTop";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />
        <Route path="/reports/new" element={<ReportNewPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
