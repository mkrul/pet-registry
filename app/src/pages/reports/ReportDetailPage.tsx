import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ReportDetail from "../../components/reports/ReportDetail";

const ReportDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    // Get all search parameters
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });

    // Ensure page parameter is preserved
    const page = searchParams.get("page");
    if (page && page !== "1") {
      params.set("page", page);
    }

    // Get saved search state to ensure we have complete context
    const savedState = sessionStorage.getItem("reportSearchState");
    if (savedState) {
      const { path } = JSON.parse(savedState);
      navigate(path);
    } else {
      // Fallback to constructed URL if no saved state
      navigate(`/reports?${params.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={handleBack} className="mb-4 text-blue-600 hover:text-blue-800">
        ← Back to reports
      </button>
      <ReportDetail />
    </div>
  );
};

export default ReportDetailPage;
