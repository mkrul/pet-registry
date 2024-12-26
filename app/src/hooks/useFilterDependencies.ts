import { useState } from "react";
import { IFilters } from "../types/search/Search";

export const useFilterDependencies = (
  initialFilters: IFilters,
  onChange: (filters: IFilters) => void
) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: filterType, value } = e.target;
    const updatedFilters =
      filterType === "country"
        ? { ...filters, [filterType]: value, state: "", city: "" }
        : filterType === "state"
          ? { ...filters, [filterType]: value, city: "" }
          : { ...filters, [filterType]: value };

    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  return {
    filters,
    handleFilterChange
  };
};
