import React, { useState, useMemo } from "react";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { genderOptionsList } from "../../lib/reports/genderOptionsList";
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
  const [breedOptions, setBreedOptions] = useState<string[]>([]);

  const genderOptions = useMemo(() => genderOptionsList, []);
  const speciesOptions = useMemo(() => speciesOptionsList, []);
  const colorOptions = useMemo(() => colorOptionsList, []);
  const sortOptions = useMemo(() => sortOptionsList, []);

  return (
    <div className="filters">
      <div>
        <label>Color:</label>
        <select name="color" onChange={handleFilterChange}>
          <option value="">Any</option>
          {colorOptions.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Species:</label>
        <select name="species" onChange={handleFilterChange}>
          <option value="">Any</option>
          {speciesOptions.map(species => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Gender:</label>
        <select name="gender" onChange={handleFilterChange}>
          <option value="">Any</option>
          <option key="male" value="male">
            Male
          </option>
          <option key="female" value="female">
            Female
          </option>
        </select>
      </div>
      <div>
        <label>Sort By:</label>
        <select name="sort" onChange={handleFilterChange}>
          {sortOptions.map(option => (
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
