import React from "react";
import { TextField, MenuItem, Select, FormControl } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { IFilters } from "../../types/search/Search";
import BreedSelect from "../reports/BreedSelect";
import LocationSelect from "../filters/LocationSelect";
import speciesListJson from "../../../../config/species.json";
import colorListJson from "../../../../config/colors.json";
import sortOptionsJson from "../../../../config/sort_options.json";
import { Species } from "../../lib/reports/breedLists";

interface IFiltersProps {
  filters: IFilters;
  handleFilterChange: (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

const Filters: React.FC<IFiltersProps> = ({ filters, handleFilterChange, onReset }) => {
  const selectStyles = {
    height: "40px",
    backgroundColor: "white !important",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white !important"
    },
    "& .MuiSelect-select": {
      backgroundColor: "white !important"
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormControl fullWidth size="small">
          <Select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            displayEmpty
            sx={selectStyles}
            displayEmpty
            renderValue={selected => selected || "Species"}
          >
            {speciesListJson.options.map((species, index) => (
              <MenuItem key={`${species}-${index}`} value={species}>
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <BreedSelect
          species={filters.species as Species | ""}
          value={filters.breed}
          onChange={(value: string) =>
            handleFilterChange({
              target: { name: "breed", value }
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        />

        <FormControl fullWidth size="small">
          <Select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              ...selectStyles,
              "& .MuiPaper-root": {
                maxHeight: "200px"
              }
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200
                }
              }
            }}
            renderValue={selected => selected || "Color"}
          >
            {colorListJson.options.map((color, index) => (
              <MenuItem key={`${color}-${index}`} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <Select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            displayEmpty
            sx={selectStyles}
            renderValue={selected => selected || "Gender"}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        <LocationSelect
          country={filters.country}
          state={filters.state}
          area={filters.area}
          onFilterChange={handleFilterChange}
          selectClassName={selectStyles}
          disabledSelectClassName={selectStyles}
        />

        <FormControl fullWidth size="small">
          <Select name="sort" value={filters.sort} onChange={handleFilterChange} sx={selectStyles}>
            <MenuItem value="Newest">Newest</MenuItem>
            {sortOptionsJson.options
              .filter(option => option !== "Newest")
              .map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Filters;
