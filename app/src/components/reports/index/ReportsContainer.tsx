import React, { useEffect } from "react";
import Spinner from "../../common/Spinner";
import { NotificationType } from "../../../types/common/Notification";
import Notification from "../../common/Notification";
import { useReportsData } from "../../../hooks/useReportsData";
import ReportsGrid from "./ReportsGrid";
import Pagination from "../../common/Pagination";
import { ReportsContainerProps } from "../../../types/Report";

const ReportsContainer: React.FC<ReportsContainerProps> = ({
  query,
  filters,
  page,
  onPageChange
}) => {
  const { reports, data, isLoading, error, refetch } = useReportsData(query, filters, page);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
    <div className="flex flex-col gap-4">
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
