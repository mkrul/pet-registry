import React from "react";
import Filters from "./Filters";
import { IFilters } from "../../types/search/Search";
import { useFilterDependencies } from "../../hooks/useFilterDependencies";

interface FilterContainerProps {
  initialFilters: IFilters;
  onFiltersChange: (filters: IFilters) => void;
  showFilters: boolean;
  onReset?: () => void;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  initialFilters,
  onFiltersChange,
  showFilters,
  onReset
}) => {
  const { filters, handleFilterChange, resetFilters } = useFilterDependencies(
    initialFilters,
    onFiltersChange
  );

  const handleReset = () => {
    resetFilters();
    onReset?.();
  };

  if (!showFilters) return null;

  return (
    <div className="w-full">
      <Filters filters={filters} handleFilterChange={handleFilterChange} onReset={handleReset} />
    </div>
  );
};

export default FilterContainer;
