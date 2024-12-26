export interface ISearchBar {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}
