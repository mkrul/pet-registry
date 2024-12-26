import React, { useState, useEffect } from "react";
import colorListJson from "../../../../config/colors.json";
import speciesListJson from "../../../../config/species.json";
import sortOptionsJson from "../../../../config/sort_options.json";
import { getBreedsBySpecies } from "../../lib/reports/breedLists";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";
import { IFiltersProps } from "../../types/search/Search";

// Add a new interface for breed suggestions
interface BreedSuggestion {
  value: string;
  label: string;
}

const Filters: React.FC<IFiltersProps> = ({ filters, handleFilterChange }) => {
  const [breedInput, setBreedInput] = useState(filters.breed);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [breedSuggestions, setBreedSuggestions] = useState<BreedSuggestion[]>([]);

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

  const breedOptions = filters.species
    ? getBreedsBySpecies(filters.species.toLowerCase() as "dog" | "cat")
    : [];

  console.log("Available states:", states);
  console.log("States type:", Array.isArray(states) ? "array" : typeof states);
  console.log("Available cities:", cities);

  const selectClassName =
    "w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap";

  const disabledSelectClassName = `${selectClassName} bg-gray-100 text-gray-400 cursor-not-allowed`;

  const handleBreedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBreedInput(value);

    if (!value) {
      setBreedSuggestions([]);
      handleFilterChange({
        target: { name: "breed", value: "" }
      } as React.ChangeEvent<HTMLSelectElement>);
      return;
    }

    const filteredSuggestions = breedOptions
      .filter(breed => breed.toLowerCase().includes(value.toLowerCase()))
      .map(breed => ({
        value: breed,
        label: breed
      }));

    setBreedSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleBreedSelect = (breed: string) => {
    setBreedInput(breed);
    setShowSuggestions(false);
    handleFilterChange({
      target: { name: "breed", value: breed }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Add effect to sync breedInput with filters.breed
  useEffect(() => {
    setBreedInput(filters.breed);
  }, [filters.breed]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
        <div className="w-full">
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Species</option>
            {speciesListJson.options.map(species => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full relative">
          <input
            type="text"
            name="breed"
            value={breedInput}
            onChange={handleBreedInputChange}
            onClick={e => {
              e.stopPropagation();
              setShowSuggestions(true);
            }}
            placeholder="Search breeds..."
            className={
              filters.species ? selectClassName : `${disabledSelectClassName} cursor-not-allowed`
            }
            disabled={!filters.species}
          />

          {showSuggestions && breedSuggestions.length > 0 && (
            <div
              className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
              onClick={e => e.stopPropagation()}
            >
              {breedSuggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.value}-${index}`}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                  onClick={() => handleBreedSelect(suggestion.value)}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full">
          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className={selectClassName}
          >
            <option value="">Color</option>
            {colorListJson.options.map(color => (
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
