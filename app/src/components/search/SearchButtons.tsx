import React from "react";
import { SearchButtonProps } from "../../types/common/Search";

const SearchButtons: React.FC<SearchButtonProps> = ({
  onSearch,
  onReset,
  showFilters,
  setShowFilters
}) => {
  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-2 border border-blue-500 rounded-md transition-colors w-32 ${
          showFilters
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "bg-white text-blue-600 hover:bg-blue-100"
        }`}
      >
        {showFilters ? "Hide filters" : "Show filters"}
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchButtons;
