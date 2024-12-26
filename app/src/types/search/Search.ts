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
  filters: {
    species: string;
    color: string;
    gender: string;
    city: string;
    state: string;
    country: string;
    sort: string;
    breed: string;
  };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
