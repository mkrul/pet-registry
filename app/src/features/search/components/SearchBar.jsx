import React from "react";
import SearchButtons from "./SearchButtons";
import { useTheme } from "../../../shared/hooks/useTheme";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onReset
}) => {
  const { isDarkMode } = useTheme();

  const inputClassName = `appearance-none border transition-colors rounded-md w-full py-2.5 px-3 pl-11 leading-tight focus:outline-none focus:ring-2 ${
    isDarkMode
      ? "border-gray-600 hover:border-gray-500 text-white placeholder-gray-300 focus:ring-blue-600 focus:border-blue-500"
      : "border-gray-300 hover:border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-blue-200 focus:border-blue-400"
  }`;

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="w-full">
        <div className="relative w-full">
          <input
            type="text"
            name="query"
            id="search_query"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            className={inputClassName}
            placeholder="Keywords (e.g. 'german', 'shepherd', 'dog')"
            autoComplete="off"
            style={
              isDarkMode
                ? { backgroundColor: "rgba(29, 29, 29, 1)" }
                : undefined
            }
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http:/www.w3.org/2000/svg"
              className="h-6 w-6 ml-3 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {searchQuery && (
            <div className="absolute right-0 inset-y-0 flex items-center">
              <button
                type="button"
                className="mr-3 h-7 w-7 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <svg
                  xmlns="http:/www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <SearchButtons onSearch={onSearch} onReset={onReset} />
    </div>
  );
};

export default SearchBar;
