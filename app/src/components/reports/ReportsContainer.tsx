import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setReports } from "../../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import ReportCard from "./ReportCard";
import Spinner from "../shared/Spinner";
import { skipToken } from "@reduxjs/toolkit/query";
import { NotificationState, NotificationType } from "../../types/Notification";
import Notification from "../shared/Notification";

interface ReportsContainerProps {
  query: string;
  filters: IFilters;
  onPageChange?: (page: number) => void;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({ query, filters, onPageChange }) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const itemsPerPage = 20;
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useGetReportsQuery({
    page: currentPage,
    items: itemsPerPage,
    query: query || undefined,
    species: filters.species || undefined,
    breed: filters.breed || undefined,
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

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: apiError.data?.message || "Failed to load reports"
      });
    }
  }, [error]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
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
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
        {reports.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            currentPage={currentPage}
            currentQuery={query}
          />
        ))}
      </div>
      {data && data.pagination && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === data.pagination.pages}
            className={`px-4 py-2 rounded ${
              currentPage === data.pagination.pages
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
