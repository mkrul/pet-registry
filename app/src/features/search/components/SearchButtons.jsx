import React from "react";

const SearchButtons = ({ onSearch, onReset }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSearch}
        className="flex-1 bg-green-600 dark:bg-green-700 text-white px-4 py-2 sm:px-4 sm:py-2 h-11 sm:h-auto rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 dark:focus-visible:outline-green-500"
      >
        {/* Mobile: Icon only, Desktop: Text only */}
        <svg
          xmlns="http:/www.w3.org/2000/svg"
          className="h-6 w-6 sm:hidden"
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
        <span className="hidden sm:inline">Search</span>
      </button>
      <button
        onClick={onReset}
        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:focus-visible:outline-blue-500"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchButtons;
