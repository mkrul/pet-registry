import React from "react";
import { getBreedsBySpecies, Species } from "../../lib/reports/breedLists";

interface IBreedSelect {
  species: Species | "";
  value: string;
  onChange: (value: string) => void;
}

const BreedSelect: React.FC<IBreedSelect> = ({ species, value, onChange }) => {
  const breeds = getBreedsBySpecies(species || null);

  return (
    <div className="w-full">
      <select
        name="breed"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap ${
          !species ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
        }`}
        disabled={!species}
      >
        <option value="">Breed</option>
        {breeds.map(breed => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BreedSelect;
