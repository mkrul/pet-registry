import React from "react";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import ReportCard from "./ReportCard";
import Spinner from "../shared/Spinner";
import { skipToken } from "@reduxjs/toolkit/query";
import { IReport } from "../../types/Report";

interface ReportsContainerProps {
  page: number;
  query: string;
  species: string[];
  gender: string[];
  color: string[];
  status: string[];
  sort: string;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({
  page,
  query,
  species,
  gender,
  color,
  status,
  sort
}) => {
  const { data, isLoading, isError } = useGetReportsQuery(
    page
      ? {
          page,
          query,
          species,
          gender,
          color,
          status,
          sort
        }
      : skipToken
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error loading reports. Please try again later.</div>
    );
  }

  const reports = data?.data || [];

  if (reports.length === 0) {
    return (
      <div className="text-center text-gray-500">No reports found matching your criteria.</div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
        {reports.map((report: IReport) => (
          <ReportCard key={report.id} report={report} currentPage={page} currentQuery={query} />
        ))}
      </div>
      {data && data.pagination && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              // Handle pagination
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              // Handle pagination
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsContainer;
