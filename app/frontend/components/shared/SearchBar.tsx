import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../redux/features/reports/reportsSlice";
import { RootState } from "../../redux/store";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const dispatch = useDispatch();
  const queryFromState = useSelector((state: RootState) => state.reports.query); // Fetch the query from Redux
  const [query, setQuery] = useState(queryFromState); // Set initial value from Redux

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setSearchQuery(query)); // Store query in Redux
    onSearch(query); // Trigger the search
  };

  const clearSearch = () => {
    setQuery("");
    dispatch(setSearchQuery("")); // Clear the query in Redux
  };

  return (
    <div className="w-full md:w-auto">
      <form action="/search_reports" onSubmit={handleSubmit} method="get" className="relative w-full">
        <div className="relative w-full">
          <input
            type="text"
            name="query"
            id="search_query"
            value={query}
            onChange={handleInputChange}
            className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-gray-300 focus:border-gray-300 focus:shadow-outline"
            placeholder="Search lost pets..."
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
                onClick={clearSearch}
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
      </form>
    </div>
  );
};

export default SearchBar;
