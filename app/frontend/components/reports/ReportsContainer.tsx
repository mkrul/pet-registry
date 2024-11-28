// src/components/reports/ReportsContainer.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setReports } from "../../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import ReportCard from "./ReportCard";
import Spinner from "../shared/Spinner";
import { IReport } from "../../types/Report";

interface ReportsContainerProps {
  query: string;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({ query }) => {
  const dispatch = useDispatch();
  const reports: IReport[] = useSelector((state: RootState) => state.reports.data);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20;

  const { data, error, isLoading } = useGetReportsQuery({
    page,
    items: itemsPerPage,
    query
  });

  useEffect(() => {
    if (data && data.data) {
      dispatch(setReports(data.data));
    }
  }, [data, dispatch]);

  const handleNextPage = () => {
    if (data?.pagination.pages && page < data.pagination.pages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">Error loading reports. Please try again later.</div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md-report:grid-cols-2 lg-report:grid-cols-3 xl-report:grid-cols-3 2xl-report:grid-cols-4 gap-4">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      {data && data.pagination && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span>
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === data.pagination.pages}
            className={`px-4 py-2 rounded ${
              page === data.pagination.pages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsContainer;
