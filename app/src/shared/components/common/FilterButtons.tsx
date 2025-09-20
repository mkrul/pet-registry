import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterButtonsProps<T = string> {
  filters: FilterOption[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  disabled?: boolean;
  activeColor?: string;
}

const FilterButtons = <T extends string>({
  filters,
  activeFilter,
  onFilterChange,
  disabled = false,
  activeColor = 'bg-blue-600'
}: FilterButtonsProps<T>) => {
  return (
    <div className="flex space-x-1 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value as T)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : activeFilter === filter.value
              ? `${activeColor} text-white`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
