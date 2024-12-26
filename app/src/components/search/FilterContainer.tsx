import React, { useState } from "react";
import Filters from "./Filters";
import { IFilters } from "../../types/search/Search";

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
  const [pendingFilters, setPendingFilters] = useState(initialFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: filterType, value } = e.target;
    const updatedFilters =
      filterType === "country"
        ? { ...pendingFilters, [filterType]: value, state: "", city: "" }
        : filterType === "state"
          ? { ...pendingFilters, [filterType]: value, city: "" }
          : { ...pendingFilters, [filterType]: value };

    setPendingFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return showFilters ? (
    <div className="w-full">
      <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
    </div>
  ) : null;
};

export default FilterContainer;
