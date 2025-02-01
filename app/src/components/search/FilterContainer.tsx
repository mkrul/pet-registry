import React from "react";
import Filters from "./Filters";
import { SelectChangeEvent } from "@mui/material";
import { FilterContainerProps } from "../../types/common/Search";

const FilterContainer: React.FC<FilterContainerProps> = ({
  initialFilters,
  onFiltersChange,
  onReset
}) => {
  const handleFilterChange = (
    e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...initialFilters, [name]: value };

    if (name === "country") {
      updatedFilters.state = "";
      updatedFilters.area = "";
    }
    if (name === "state") {
      updatedFilters.area = "";
    }

    onFiltersChange(updatedFilters);
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-visible">
      <Filters filters={initialFilters} handleFilterChange={handleFilterChange} onReset={onReset} />
    </div>
  );
};

export default FilterContainer;
