import React from "react";
import { IFiltersProps } from "../../types/search/Search";
import BreedSelect from "../reports/BreedSelect";
import LocationSelect from "../filters/LocationSelect";
import speciesListJson from "../../../../config/species.json";
import colorListJson from "../../../../config/colors.json";
import sortOptionsJson from "../../../../config/sort_options.json";
import { Species } from "../../lib/reports/breedLists";
const Filters: React.FC<IFiltersProps> = ({ filters, handleFilterChange }) => {
  const selectClassName =
    "w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap";
  const disabledSelectClassName = `${selectClassName} bg-gray-100 text-gray-400 cursor-not-allowed`;

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="w-full">
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Species</option>
            {speciesListJson.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <BreedSelect
          species={filters.species as Species | ""}
          value={filters.breed}
          onChange={(value: string) =>
            handleFilterChange({
              target: { name: "breed", value }
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        />

        <div className="w-full">
          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Color</option>
            {colorListJson.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <LocationSelect
          country={filters.country}
          state={filters.state}
          city={filters.city}
          onFilterChange={handleFilterChange}
          selectClassName={selectClassName}
          disabledSelectClassName={disabledSelectClassName}
        />

        <div className="w-full">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="Newest">Newest</option>
            {sortOptionsJson.options
              .filter(option => option !== "Newest")
              .map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
