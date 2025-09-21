import React from "react";
import Spinner from "../../../../shared/components/common/Spinner";
import Notification from "../../../../shared/components/common/Notification";
import { useReportsData } from "../../../../shared/hooks/useReportsData";
import ReportsGrid from "./ReportsGrid";
import { FiltersProps } from "../../../../shared/types/common/Search";

const ReportsContainer = ({
  query,
  filters,
  page,
  onPageChange,
}) => {
  const { reports, data, isLoading, error } = useReportsData(query, filters, page);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Notification
        type={NotificationType.ERROR}
        message="An error occurred while loading reports"
        onClose={() => {}}
      />
    );
  }

  return (
    <ReportsGrid
      reports={reports}
      currentPage={page}
      currentQuery={query}
      pagination={data?.pagination}
      onPageChange={onPageChange}
    />
  );
};

export default ReportsContainer;
