import { SelectChangeEvent } from "@mui/material";

export interface SearchButtonProps {
  onSearch: () => void;
  onReset: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export interface SearchContainerProps {
  onSearchComplete: (query: string, page: number, filters: FiltersProps) => void;
}

export interface FilterContainerProps {
  initialFilters: FiltersProps;
  onFiltersChange: (filters: FiltersProps) => void;
  showFilters: boolean;
  onReset: () => void;
}

export interface FiltersProps {
  species: string;
  color: string;
  gender: string;
  area: string;
  state: string;
  country: string;
  sort: string;
  breed: string;
}

export interface FiltersHandlerProps {
  filters: FiltersProps;
  handleFilterChange: (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

export interface SearchContainerQueryProps {
  initialQuery: string;
  initialFilters: FiltersProps;
  onSearch: (query: string, filters: FiltersProps) => void;
  onReset: () => void;
}

export interface FiltersPropsProps {
  filters: FiltersProps;
  handleFilterChange: (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface LocationFilterProps {
  country: string;
  state: string;
  area: string;
  onFilterChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  selectClassName: any;
  disabledSelectClassName: any;
}
