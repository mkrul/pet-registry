export interface ISearchBar {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onReset?: () => void;
}
