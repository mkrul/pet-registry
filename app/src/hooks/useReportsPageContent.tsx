import { useMemo } from "react";
import { FiltersProps } from "../types/common/Search";

export interface ReportsContentProps {
  activeSearch: string;
  currentPage: number;
  activeFilters: FiltersProps;
  handlePageChange: (page: number) => void;
}

export interface ReportsContainerProps {
  query: string;
  filters: FiltersProps;
  page: number;
  onPageChange: (page: number) => void;
}

export const useReportsContent = ({
  activeSearch,
  currentPage,
  activeFilters,
  handlePageChange
}: ReportsContentProps): ReportsContainerProps => {
  return useMemo(
    () => ({
      query: activeSearch,
      filters: activeFilters,
      page: currentPage,
      onPageChange: handlePageChange
    }),
    [currentPage, activeSearch, activeFilters, handlePageChange]
  );
};
