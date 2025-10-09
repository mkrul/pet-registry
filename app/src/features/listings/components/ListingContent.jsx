import { useMemo } from "react";
import { FiltersProps } from "../../../../shared/types/common/Search";
import ListingsContainer from "./ListingsContainer";

export const ReportsContent = ({
  activeSearch,
  currentPage,
  activeFilters,
  handlePageChange
}) => {
  return useMemo(
    () => (
      <ListingsContainer
        query={activeSearch}
        filters={activeFilters}
        page={currentPage}
        onPageChange={handlePageChange}
      />
    ),
    [currentPage, activeSearch, activeFilters, handlePageChange]
  );
};


