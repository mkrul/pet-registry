import React from "react";
import { SearchBarProps } from "../../types/common/Search";
import SearchButtons from "./SearchButtons";

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onReset,
  showFilters,
  setShowFilters
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full xl:w-2/5 flex content-end xl:ml-auto">
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
            className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-gray-300 focus:border-gray-300 focus:shadow-outline"
            placeholder="Enter keywords (e.g. 'black', 'female', 'cat', etc.)"
            autoComplete="off"
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
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
                className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                onClick={() => setSearchQuery("")}
              ></button>
            </div>
          )}
        </div>
      </div>

      <SearchButtons
        onSearch={onSearch}
        onReset={onReset}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </div>
  );
};

export default SearchBar;
