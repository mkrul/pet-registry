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
        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Search
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
