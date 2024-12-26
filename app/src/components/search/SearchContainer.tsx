import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterContainer from "./FilterContainer";
import { IFilters } from "../../types/search/Search";
import { getInitialFilters, getDefaultFilters, updateSearchParams } from "../../utils/filterUtils";

interface SearchContainerProps {
  onSearchComplete: (query: string, page: number, filters: IFilters) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ onSearchComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IFilters>(getInitialFilters(searchParams));

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
    const defaultFilters = getDefaultFilters();
    setSearchQuery("");
    setFilters(defaultFilters);
    setSearchParams({});
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
      />
    </>
  );
};

export default SearchContainer;
