import React from "react";
import Spinner from "../shared/Spinner";
import { NotificationType } from "../../types/Notification";
import Notification from "../shared/Notification";
import { IFilters } from "../../types/search/Search";
import { useReportsData } from "../../hooks/useReportsData";
import ReportsGrid from "./ReportsGrid";
import Pagination from "../shared/Pagination";
import { usePagination } from "../../hooks/usePagination";

interface ReportsContainerProps {
  query: string;
  filters: IFilters;
  onPageChange?: (page: number) => void;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({ query, filters, onPageChange }) => {
  const { currentPage, handlePageChange } = usePagination(onPageChange);
  const { reports, data, isLoading, error, notification, setNotification } = useReportsData(
    query,
    filters,
    currentPage
  );

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Notification
        type={NotificationType.ERROR}
        message={"An error occurred while loading reports"}
        onClose={() => {}}
      />
    );

  return (
    <div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <ReportsGrid reports={reports} currentPage={currentPage} currentQuery={query} />
      {data?.pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ReportsContainer;
