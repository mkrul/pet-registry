import { SelectChangeEvent } from "@mui/material";

export interface ISearchButtons {
  onSearch: () => void;
  onReset: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export interface ISearchBar {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export interface IFilters {
  species: string;
  color: string;
  gender: string;
  area: string;
  state: string;
  country: string;
  sort: string;
  breed: string;
}

export interface ISearchContainer {
  initialQuery: string;
  initialFilters: IFilters;
  onSearch: (query: string, filters: IFilters) => void;
  onReset: () => void;
}

export interface IFiltersProps {
  filters: IFilters;
  handleFilterChange: (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => void;
}
