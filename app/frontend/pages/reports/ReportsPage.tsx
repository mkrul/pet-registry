import React from "react";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";

const ReportsPage = () => {
  return (
    <div className="sm-report:w-7/7 md-report:w-7/7 lg-report:w-6/7 xl-report:w-6/7 xl-report:w-6/7 mx-auto p-4">
      <div className="flex justify-between grid grid-cols-1 md-report:grid-cols-2 lg-report:grid-cols-3 xl-report:grid-cols-4 gap-4">
        <div className="sm-report:flex md-report:hidden lg-report:hidden xl-report:hidden mb-4">
          <SearchBar />
        </div>
        <h1 className="text-3xl font-bold text-blue-600">Lost Pets</h1>
        <div className="hidden lg-report:hidden xl-report:flex"></div>
        <div className="hidden lg-report:flex xl-report:flex"></div>
        <div className="hidden md-report:flex lg-report:flex xl-report:flex">
          <SearchBar />
        </div>
      </div>
      <div className="mt-[3rem]">
        <ReportsContainer />
      </div>
    </div>
  );
};

export default ReportsPage;
