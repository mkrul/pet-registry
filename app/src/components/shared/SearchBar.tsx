import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../redux/features/reports/reportsSlice";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onReset?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    dispatch(setSearchQuery(query));
    onSearch(query);
  };

  const handleReset = () => {
    setQuery("");
    dispatch(setSearchQuery(""));
    onSearch("");
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="w-full md:w-auto">
      <div className="relative w-full flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="query"
            id="search_query"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-gray-300 focus:border-gray-300 focus:shadow-outline"
            placeholder="Enter descriptive keywords..."
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

          {query && (
            <div className="absolute right-0 inset-y-0 flex items-center">
              <button
                type="button"
                className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                onClick={() => setQuery("")}
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
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
