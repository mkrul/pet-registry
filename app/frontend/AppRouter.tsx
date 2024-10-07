import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/shared/Navbar";
import ReportIndexPage from "./pages/reports/ReportsIndexPage";
import ReportNewPage from "./pages/reports/ReportNewPage";
import ReportShowPage from "./pages/reports/ReportShowPage";
import Footer from "./components/shared/Footer";

const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<ReportIndexPage />} />
        <Route path="/reports/new" element={<ReportNewPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
