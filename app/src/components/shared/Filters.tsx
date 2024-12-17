import React from "react";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { speciesOptionsList } from "../../lib/reports/speciesOptionsList";
import { sortOptionsList } from "../../lib/reports/sortOptionsList";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";

interface FiltersProps {
  filters: {
    species: string;
    color: string;
    gender: string;
    city: string;
    state: string;
    country: string;
    sort: string;
  };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, handleFilterChange }) => {
  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery(filters.country, {
    skip: !filters.country
  });

  const { data: cities = [], isLoading: isLoadingCities } = useGetCitiesQuery(
    {
      country: filters.country,
      state: filters.state
    },
    {
      skip: !filters.country || !filters.state
    }
  );

  console.log("Available states:", states);
  console.log("States type:", Array.isArray(states) ? "array" : typeof states);
  console.log("Available cities:", cities);

  const selectClassName =
    "w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap";

  const disabledSelectClassName = `${selectClassName} bg-gray-100 text-gray-400 cursor-not-allowed`;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-3 md:grid-cols-4 3xl:flex 3xl:flex-row gap-2">
        <div className="w-full">
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Species</option>
            {speciesOptionsList.map(species => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Color</option>
            {colorOptionsList.map(color => (
              <option key={color} value={color}>
                {color}
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
        <div className="w-full">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Sort by</option>
            {sortOptionsList.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className={
              filters.country && !isLoadingStates ? selectClassName : disabledSelectClassName
            }
            disabled={!filters.country || isLoadingStates}
          >
            <option value="">State</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className={
              filters.country && filters.state && !isLoadingCities
                ? selectClassName
                : disabledSelectClassName
            }
            disabled={!filters.country || !filters.state || isLoadingCities}
          >
            <option value="">City</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Country</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
