import React from "react";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { speciesOptionsList } from "../../lib/reports/speciesOptionsList";
import { sortOptionsList } from "../../lib/reports/sortOptionsList";

interface FiltersProps {
  onChange: (filters: {
    species: string[];
    gender: string[];
    color: string[];
    status: string[];
    sort: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onChange }) => {
  const selectClassName =
    "w-full min-w-[100px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 whitespace-nowrap";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      <div className="flex w-full sm:flex-1 gap-2">
        <select
          name="species"
          className={selectClassName}
          onChange={e =>
            onChange({ species: [e.target.value], gender: [], color: [], status: [], sort: "" })
          }
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
          className={selectClassName}
          onChange={e =>
            onChange({ species: [], gender: [], color: [e.target.value], status: [], sort: "" })
          }
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
          className={selectClassName}
          onChange={e =>
            onChange({ species: [], gender: [e.target.value], color: [], status: [], sort: "" })
          }
        >
          <option value="">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          name="sort"
          className={selectClassName}
          onChange={e =>
            onChange({ species: [], gender: [], color: [], status: [], sort: e.target.value })
          }
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
