import React from "react";
import Filters from "./Filters";
import { IFilters } from "../../types/search/Search";
import { SelectChangeEvent } from "@mui/material";

interface FilterContainerProps {
  initialFilters: IFilters;
  onFiltersChange: (filters: IFilters) => void;
  showFilters: boolean;
  onReset: () => void;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  initialFilters,
  onFiltersChange,
  showFilters,
  onReset
}) => {
  const handleFilterChange = (
    e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...initialFilters, [name]: value };

    // If country changes, reset state and area
    if (name === "country") {
      updatedFilters.state = "";
      updatedFilters.area = "";
    }
    // If state changes, reset area
    if (name === "state") {
      updatedFilters.area = "";
    }

    onFiltersChange(updatedFilters);
  };

  if (!showFilters) return null;

  return (
    <div className="w-full">
      <Filters filters={initialFilters} handleFilterChange={handleFilterChange} onReset={onReset} />
    </div>
  );
};

export default FilterContainer;
