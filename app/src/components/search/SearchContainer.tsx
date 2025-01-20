import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterContainer from "./FilterContainer";
import { FiltersProps, SearchContainerProps } from "../../types/common/Search";
import { getInitialFilters, getDefaultFilters, updateSearchParams } from "../../utils/filterUtils";

const SearchContainer: React.FC<SearchContainerProps> = ({ onSearchComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(getInitialFilters(searchParams));

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    setSearchQuery(queryParam);
    setFilters(getInitialFilters(searchParams));
  }, [searchParams]);

  const handleSearch = () => {
    updateSearchParams(searchQuery, filters);
    onSearchComplete(searchQuery, 1, filters);
  };

  const handleReset = () => {
    // Clear all URL params including sort
    const currentPath = window.location.pathname;
    window.history.replaceState({}, "", currentPath);
    setSearchParams({});

    const defaultFilters = getDefaultFilters();
    setSearchQuery("");
    setFilters(defaultFilters);
    window.scrollTo(0, 0);

    onSearchComplete("", 1, defaultFilters);
  };

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onReset={handleReset}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <FilterContainer
        initialFilters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        onReset={handleReset}
      />
    </>
  );
};

export default SearchContainer;
