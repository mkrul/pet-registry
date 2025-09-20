import { useMemo } from "react";
import { FiltersProps } from "../../../../shared/types/common/Search";
import ReportsContainer from "./ReportsContainer";

export interface ReportsContentProps {
  activeSearch: string;
  currentPage: number;
  activeFilters: FiltersProps;
  handlePageChange: (page: number) => void;
}

export const ReportsContent = ({
  activeSearch,
  currentPage,
  activeFilters,
  handlePageChange
}: ReportsContentProps) => {
  return useMemo(
    () => (
      <ReportsContainer
        query={activeSearch}
        filters={activeFilters}
        page={currentPage}
      />
    ),
    [currentPage, activeSearch, activeFilters, handlePageChange]
  );
};


