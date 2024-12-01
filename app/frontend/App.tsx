import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop"; // Adjust the path if necessary
import ReportsIndexPage from "./pages/reports/ReportsIndexPage";
import ReportShowPage from "./pages/reports/ReportShowPage";
// Import other pages/components as needed

/**
 * App Component
 *
 * This is the root component of the application. It sets up the router and
 * includes the ScrollToTop component to manage scroll behavior on route changes.
 */
const App: React.FC = () => {
  return (
    <Router>
      {/* ScrollToTop listens to route changes and scrolls to top */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reports" element={<ReportsIndexPage />} />
        <Route path="/reports/:id" element={<ReportShowPage />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
