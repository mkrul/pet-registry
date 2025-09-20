import React from "react";

interface SearchButtonsProps {
  onSearch: () => void;
  onReset: () => void;
}

const SearchButtons: React.FC<SearchButtonsProps> = ({ onSearch, onReset }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSearch}
        className="flex-1 bg-green-600 text-white px-4 py-2 sm:px-4 sm:py-2 h-11 sm:h-auto rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
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
        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchButtons;
