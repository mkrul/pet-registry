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
      // Do not include breed in the URL search params anymore
      if (key !== "breed" && value) params.set(key, value);
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

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <FilterContainer
          initialFilters={filters}
          onFiltersChange={setFilters}
          onReset={handleReset}
          rememberFilters={rememberFilters}
          onRememberFiltersToggle={handleRememberFiltersToggle}
        />
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 p-3 mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors">
        <button
          onClick={handleSearchTipsToggle}
          className="font-semibold text-base flex items-center justify-between w-full text-gray-800 dark:text-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400 rounded-md"
          aria-expanded={isSearchTipsOpen}
          aria-controls="search-tips-content"
        >
          <span>Search Tips</span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{isSearchTipsOpen ? "▼" : "▶"}</span>
        </button>
        <div
          id="search-tips-content"
          className={isSearchTipsOpen ? "block" : "hidden"}
          aria-hidden={!isSearchTipsOpen}
        >
          <ul className="space-y-2">
            <li className="mt-2">
              <Tip emoji="🔍" showTipLabel={false}>
                Adding filters can improve your search.
              </Tip>
            </li>
            <li>
              <Tip emoji="🔍" showTipLabel={false}>
                Double check spelling & use simple keywords
              </Tip>
            </li>
            <li>
              <Tip emoji="🔍" showTipLabel={false}>
                Try different keywords (e.g., an American Bully might have been reported as a "bulldog" or "pit bull")
              </Tip>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchContainer;
