import { useState } from "react";
const defaultFilters = {
  species: "",
  breed: "",
  color: "",
  gender: "",
  country: "",
  state: "",
  area: "",
  sort: "Newest"
};

export const useFilterDependencies = (initialFilters, onChange) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onChange(defaultFilters);
  };

  return {
    filters,
    handleFilterChange,
    resetFilters
  };
};
