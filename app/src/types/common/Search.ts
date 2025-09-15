import { SelectChangeEvent } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface SearchContainerProps {
  onSearchComplete: (query: string, page: number, filters: FiltersProps) => void;
}

export interface FilterContainerProps {
  initialFilters: FiltersProps;
  onFiltersChange: (filters: FiltersProps) => void;
  onReset: () => void;
  rememberFilters: boolean;
  onRememberFiltersToggle: (enabled: boolean) => void;
}

export interface FiltersProps {
  species: string;
  color: string;
  gender: string;
  state: string;
  area: string;
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
  state: string;
  onFilterChange: (
    event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>,
    child?: React.ReactNode
  ) => void;
  selectClassName: SxProps<Theme>;
}
