import { useMemo } from "react";
import { FiltersProps } from "../types/common/Search";
import ReportsContainer from "../components/reports/index/ReportsContainer";

export interface ReportsContentProps {
  activeSearch: string;
  currentPage: number;
  activeFilters: FiltersProps;
  handlePageChange: (page: number) => void;
}

export const useReportsContent = ({
  activeSearch,
  currentPage,
  activeFilters,
  handlePageChange,
}: ReportsContentProps) => {
  return useMemo(
    () => (
      <ReportsContainer
        key={currentPage}
        query={activeSearch}
        filters={activeFilters}
        page={currentPage}
        onPageChange={handlePageChange}
      />
    ),
    [currentPage, activeSearch, activeFilters, handlePageChange]
  );
};