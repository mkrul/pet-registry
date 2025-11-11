import React from "react";
import { useReportsData } from "../../../shared/hooks/useReportsData.js";
import ListingsGrid from "./ListingsGrid.jsx";

const ListingsContainer = ({
  query,
  filters,
  page,
  onPageChange,
}) => {
  const { reports, data } = useReportsData(query, filters, page);

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
