import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterContainer from "./FilterContainer";
import Tip from "../../../shared/components/common/Tip.jsx";
import {
  getInitialFilters,
  getInitialSearchQuery,
  getDefaultFilters,
  updateSearchParams,
  saveSearchToLocalStorage,
  clearSearchFromLocalStorage
} from "../../../shared/utils/filterUtils.js";

const SearchContainer = ({ onSearchComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => getInitialSearchQuery(searchParams));
  const [filters, setFilters] = useState(() => getInitialFilters(searchParams));
  const [isSearchTipsOpen, setIsSearchTipsOpen] = useState(() => {
    const saved = localStorage.getItem('searchTipsOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [rememberFilters, setRememberFilters] = useState(() => {
    const saved = localStorage.getItem('rememberFiltersEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    setSearchQuery(queryParam);
    setFilters(getInitialFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    if (rememberFilters) {
      saveSearchToLocalStorage(searchQuery, filters);
    } else {
      clearSearchFromLocalStorage();
    }
  }, [searchQuery, filters, rememberFilters]);

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

    if (rememberFilters) {
      clearSearchFromLocalStorage();
    }

    updateSearchParams("", defaultFilters);
  };

  const handleSearchTipsToggle = () => {
    const newState = !isSearchTipsOpen;
    setIsSearchTipsOpen(newState);
    localStorage.setItem('searchTipsOpen', JSON.stringify(newState));
  };

  const handleRememberFiltersToggle = (enabled) => {
    setRememberFilters(enabled);
    localStorage.setItem('rememberFiltersEnabled', JSON.stringify(enabled));

    if (enabled) {
      saveSearchToLocalStorage(searchQuery, filters);
    } else {
      clearSearchFromLocalStorage();
    }
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
          onClick={handleSearchTipsToggle}
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
              <li className="mb-1">
                <Tip emoji="🔍" showTipLabel={false}>
                  Adding filters can improve or narrow down your search.
                </Tip>
              </li>
              <Tip emoji="🔍" showTipLabel={false}>
                Double check your spelling and use simple keywords
              </Tip>
            </li>
            <li className="mb-1">
              <Tip emoji="🔍" showTipLabel={false}>
                Try different keywords if you can't find what you're looking for. For example, a lost American Bully might have been reported as a "bulldog" or "pit bull".
              </Tip>
            </li>
          </ul>
        </div>
      </div>

      <FilterContainer
        initialFilters={filters}
        onFiltersChange={setFilters}
        onReset={handleReset}
        rememberFilters={rememberFilters}
        onRememberFiltersToggle={handleRememberFiltersToggle}
      />
    </>
  );
};

export default SearchContainer;
