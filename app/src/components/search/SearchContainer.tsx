import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterContainer from "./FilterContainer";
import { FiltersProps, SearchContainerProps } from "../../types/common/Search";
import { getInitialFilters, getDefaultFilters, updateSearchParams } from "../../utils/filterUtils";

const SearchContainer: React.FC<SearchContainerProps> = ({ onSearchComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState<FiltersProps>(getInitialFilters(searchParams));
  const [isSearchTipsOpen, setIsSearchTipsOpen] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    setSearchQuery(queryParam);
    setFilters(getInitialFilters(searchParams));
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);

    updateSearchParams(searchQuery, filters);
    onSearchComplete(searchQuery, 1, filters);
  };

  const handleReset = () => {
    const currentPath = window.location.pathname;
    window.history.replaceState({}, "", currentPath);
    setSearchParams({});

    const defaultFilters = getDefaultFilters();
    setSearchQuery("");
    setFilters(defaultFilters);
    window.scrollTo(0, 0);

    updateSearchParams("", defaultFilters);
  };

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="text-sm text-gray-500 p-2 mt-2">
        <button
          onClick={() => setIsSearchTipsOpen(!isSearchTipsOpen)}
          className="font-semibold text-base mb-1 flex items-center w-full"
          aria-expanded={isSearchTipsOpen}
          aria-controls="search-tips-content"
        >
          <span>Search Tips</span>
          <span className="ml-2 text-xs">{isSearchTipsOpen ? "▼" : "▶"}</span>
        </button>
        <div
          id="search-tips-content"
          className={isSearchTipsOpen ? "block" : "hidden"}
          aria-hidden={!isSearchTipsOpen}
        >
          <ul>
            <li className="mb-1">
              <span>🔍</span>
              <span className="ml-1">Adding filters can improve or narrow down your search.</span>
            </li>
            <li>
              <span>🔍</span>
              <span className="ml-1">
                If you do not see a specific breed option, this means that no lost pets of that
                breed have been reported.
              </span>
            </li>
            <li>
              <span>🔍</span>
              <span className="ml-1">
                If you do not see a specific location option, this means that no lost pets have been
                reported in that state.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <FilterContainer
        initialFilters={filters}
        onFiltersChange={setFilters}
        onReset={handleReset}
      />
    </>
  );
};

export default SearchContainer;
