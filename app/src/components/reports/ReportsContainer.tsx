import React from "react";
import Spinner from "../shared/Spinner";
import { NotificationType } from "../../types/Notification";
import Notification from "../shared/Notification";
import { IFilters } from "../../types/search/Search";
import { useReportsData } from "../../hooks/useReportsData";
import ReportsGrid from "./ReportsGrid";
import Pagination from "../shared/Pagination";

interface ReportsContainerProps {
  query: string;
  filters: IFilters;
  page: number;
  onPageChange: (page: number) => void;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({
  query,
  filters,
  page,
  onPageChange
}) => {
  const { reports, data, isLoading, error, notification, setNotification } = useReportsData(
    query,
    filters,
    page
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
      <ReportsGrid reports={reports} currentPage={page} currentQuery={query} />
      {data?.pagination && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ReportsContainer;
