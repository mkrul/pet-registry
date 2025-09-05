import React from "react";
import Spinner from "../../common/Spinner";
import { NotificationType } from "../../../types/common/Notification";
import Notification from "../../common/Notification";
import { useReportsData } from "../../../hooks/useReportsData";
import ReportsGrid from "./ReportsGrid";
import { FiltersProps } from "../../../types/common/Search";

interface ReportsContainerProps {
  query: string;
  filters: FiltersProps;
  page: number;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({
  query,
  filters,
  page,
}) => {
  const { reports, isLoading, error } = useReportsData(query, filters, page);

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

  return <ReportsGrid reports={reports} currentPage={page} currentQuery={query} />;
};

export default ReportsContainer;
