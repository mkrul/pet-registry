import React from "react";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import { useReportsData } from "../../../shared/hooks/useReportsData.js";
import ListingsGrid from "./ListingsGrid.jsx";

const ListingsContainer = ({
  query,
  filters,
  page,
  onPageChange,
}) => {
  const { reports, data, isLoading } = useReportsData(query, filters, page);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
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
