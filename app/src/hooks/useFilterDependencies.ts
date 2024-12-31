import { useState } from "react";
import { FiltersProps } from "../types/common/Search";
import { SelectChangeEvent } from "@mui/material";

const defaultFilters: FiltersProps = {
  species: "",
  breed: "",
  color: "",
  gender: "",
  country: "",
  state: "",
  area: "",
  sort: "Newest"
};

export const useFilterDependencies = (
  initialFilters: FiltersProps,
  onChange: (filters: FiltersProps) => void
) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (
    e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>
  ) => {
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
