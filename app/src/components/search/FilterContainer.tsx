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

    // If country changes, reset state and city
    if (name === "country") {
      updatedFilters.state = "";
      updatedFilters.city = "";
    }
    // If state changes, reset city
    if (name === "state") {
      updatedFilters.city = "";
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
