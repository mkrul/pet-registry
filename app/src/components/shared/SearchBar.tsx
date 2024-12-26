import React from "react";
import { ISearchBar } from "../../types/shared/SearchBar";

const SearchBar: React.FC<ISearchBar> = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className="w-full">
      <div className="relative">
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
          placeholder="Enter keywords (e.g. 'black', 'tabby', 'cat', etc.)"
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
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
