import React from "react";
import ReportsContainer from "../../components/reports/ReportsContainer";

const ReportsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-600 mt-3 mb-6">Lost Pets</h1>
      <ReportsContainer />
    </div>
  );
};

export default ReportsPage;
