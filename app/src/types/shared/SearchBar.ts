export interface ISearchBar {
  onSearch: (query: string) => void;
  onReset?: () => void;
}
