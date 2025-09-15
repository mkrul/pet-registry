import React from "react";
import Filters from "./Filters";
import RememberFiltersToggle from "../common/RememberFiltersToggle";
import { SelectChangeEvent } from "@mui/material";
import { FilterContainerProps } from "../../types/common/Search";

const FilterContainer: React.FC<FilterContainerProps> = ({
  initialFilters,
  onFiltersChange,
  onReset,
  rememberFilters,
  onRememberFiltersToggle
}) => {
  const handleFilterChange = (
    e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...initialFilters, [name]: value };
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-visible">
      <Filters filters={initialFilters} handleFilterChange={handleFilterChange} onReset={onReset} />
      <RememberFiltersToggle
        isEnabled={rememberFilters}
        onToggle={onRememberFiltersToggle}
      />
    </div>
  );
};

export default FilterContainer;
