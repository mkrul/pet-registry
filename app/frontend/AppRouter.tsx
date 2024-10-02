import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/shared/Navbar";
import ReportsPage from "./pages/reports/ReportsPage";
import NewReportPage from "./pages/reports/NewReportPage";
import Footer from "./components/shared/Footer";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<ReportsPage />} />
        <Route path="/reports/new" element={<NewReportPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
