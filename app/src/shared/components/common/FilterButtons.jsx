import React from 'react';

const FilterButtons = ({
  filters,
  activeFilter,
  onFilterChange,
  disabled = false,
  activeColor = 'bg-blue-600'
}) => {
  return (
    <div className="flex space-x-1 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : activeFilter === filter.value
              ? `${activeColor} text-white`
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
