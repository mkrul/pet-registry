import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setReports } from "../../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import ReportCard from "./ReportCard";
import Spinner from "../shared/Spinner";
import { skipToken } from "@reduxjs/toolkit/query";

interface ReportsContainerProps {
  query: string;
  page: number;
  filters: {
    species?: string;
    color?: string;
    gender?: string;
    sort?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  onPageChange: (page: number) => void;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({
  query,
  page,
  filters,
  onPageChange
}) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const itemsPerPage = 20;

  const { data, error, isLoading } = useGetReportsQuery({
    page,
    items: itemsPerPage,
    query: query || undefined,
    species: filters.species || undefined,
    color: filters.color || undefined,
    gender: filters.gender || undefined,
    sort: filters.sort || undefined,
    country: filters.country || undefined,
    state: filters.state || undefined,
    city: filters.city || undefined
  });

  useEffect(() => {
    if (data && data.data) {
      dispatch(setReports(data.data));
    }
  }, [data, dispatch]);

  const handleNextPage = () => {
    if (data?.pagination.pages && page < data.pagination.pages) {
      onPageChange(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} currentPage={page} currentQuery={query} />
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
