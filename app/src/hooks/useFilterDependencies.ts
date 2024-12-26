import { useState } from "react";
import { IFilters } from "../types/search/Search";
import { SelectChangeEvent } from "@mui/material";

const defaultFilters: IFilters = {
  species: "",
  breed: "",
  color: "",
  gender: "",
  country: "",
  state: "",
  city: "",
  sort: "Newest"
};

export const useFilterDependencies = (
  initialFilters: IFilters,
  onChange: (filters: IFilters) => void
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
