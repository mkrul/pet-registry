import { useMemo } from "react";
import { FiltersProps } from "../../../../shared/types/common/Search";
import ReportsContainer from "./ReportsContainer";

export const ReportsContent = ({
  activeSearch,
  currentPage,
  activeFilters,
  handlePageChange
}) => {
  return useMemo(
    () => (
      <ReportsContainer
        query={activeSearch}
        filters={activeFilters}
        page={currentPage}
        onPageChange={handlePageChange}
      />
    ),
    [currentPage, activeSearch, activeFilters, handlePageChange]
  );
};


