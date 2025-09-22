import React from "react";
import Filters from "./Filters";
import RememberFiltersToggle from "../../../shared/components/common/RememberFiltersToggle.jsx";
import { SelectChangeEvent } from "@mui/material";

const FilterContainer = ({
  initialFilters,
  onFiltersChange,
  onReset,
  rememberFilters,
  onRememberFiltersToggle
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...initialFilters, [name]: value };
    onFiltersChange(updatedFilters);
  };

  const handleClearFilter = (filterName) => {
    const updatedFilters = { ...initialFilters, [filterName]: "" };
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-visible">
      <div className="p-2">
        <Filters
          filters={initialFilters}
          handleFilterChange={handleFilterChange}
          onReset={onReset}
          onClearFilter={handleClearFilter}
        />
        <div className="mt-4">
          <RememberFiltersToggle
            isEnabled={rememberFilters}
            onToggle={onRememberFiltersToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterContainer;
