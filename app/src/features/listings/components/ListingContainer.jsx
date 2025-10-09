import React from "react";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import Notification from "../../../shared/components/common/Notification.jsx";
import { useReportsData } from "../../../shared/hooks/useReportsData.js";
import ListingsGrid from "./ListingsGrid.jsx";

const ListingsContainer = ({
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
        type="ERROR"
        message="An error occurred while loading reports"
        onClose={() => {}}
      />
    );
  }

  return (
    <ListingsGrid
      reports={reports}
      currentPage={page}
      currentQuery={query}
      pagination={data?.pagination}
      onPageChange={onPageChange}
    />
  );
};

export default ListingsContainer;
