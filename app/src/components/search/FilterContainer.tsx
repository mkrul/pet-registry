import React from "react";
import Filters from "./Filters";
import { IFilters } from "../../types/search/Search";
import { useFilterDependencies } from "../../hooks/useFilterDependencies";

interface FilterContainerProps {
  initialFilters: IFilters;
  onFiltersChange: (filters: IFilters) => void;
  showFilters: boolean;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  initialFilters,
  onFiltersChange,
  showFilters
}) => {
  const { filters, handleFilterChange } = useFilterDependencies(initialFilters, onFiltersChange);

  if (!showFilters) return null;

  return (
    <div className="w-full">
      <Filters filters={filters} handleFilterChange={handleFilterChange} />
    </div>
  );
};

export default FilterContainer;
