import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import ReportsIndexPage from "./pages/reports/ReportsIndexPage";
import ReportShowPage from "./pages/reports/ReportShowPage";
import { useGetCurrentUserQuery } from "./redux/features/auth/authApiSlice";

const App: React.FC = () => {
  // This will automatically fetch the current user when the app loads
  const { isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/reports" element={<ReportsIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />
      </Routes>
    </Router>
  );
};

export default App;
