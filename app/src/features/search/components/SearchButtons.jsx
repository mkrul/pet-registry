import React from "react";

const SearchButtons = ({ onSearch, onReset }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSearch}
        className="flex-1 bg-green-600 dark:bg-green-700 text-white px-4 py-2 h-11 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 dark:focus-visible:outline-green-500"
      >
        Search
      </button>
      <button
        onClick={onReset}
        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:focus-visible:outline-blue-500"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchButtons;
