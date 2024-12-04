import React from "react";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { speciesOptionsList } from "../../lib/reports/speciesOptionsList";
import { sortOptionsList } from "../../lib/reports/sortOptionsList";

interface FiltersProps {
  filters: {
    color?: string;
    species?: string;
    gender?: string;
    sort?: string;
  };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, handleFilterChange }) => {
  const selectClassName =
    "w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      <div className="flex w-full sm:flex-1 gap-2">
        <select
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
          className={selectClassName}
        >
          <option value="">Any Species</option>
          {speciesOptionsList.map(species => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>

        <select
          name="color"
          value={filters.color}
          onChange={handleFilterChange}
          className={selectClassName}
        >
          <option value="">Any Color</option>
          {colorOptionsList.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full sm:flex-1 gap-2">
        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          className={selectClassName}
        >
          <option value="">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className={selectClassName}
        >
          {sortOptionsList.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
