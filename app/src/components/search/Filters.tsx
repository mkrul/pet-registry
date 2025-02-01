import React from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import BreedSearch from "../common/BreedSearch";
import LocationFilter from "../search/LocationFilter";
import speciesListJson from "../../../../config/species.json";
import colorListJson from "../../../../config/colors.json";
import sortOptionsJson from "../../../../config/sort_options.json";
import { Species } from "../../lib/reports/breedList";
import { FiltersHandlerProps } from "../../types/common/Search";

const Filters: React.FC<FiltersHandlerProps> = ({ filters, handleFilterChange, onReset }) => {
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

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200
      }
    },
    disableScrollLock: true
  };

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2">
        <FormControl fullWidth size="small">
          <Select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            displayEmpty
            sx={selectStyles}
            MenuProps={menuProps}
            renderValue={selected => selected || "Species"}
          >
            {speciesListJson.options.map((species, index) => (
              <MenuItem key={`${species}-${index}`} value={species}>
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <BreedSearch
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
            sx={selectStyles}
            MenuProps={menuProps}
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
            MenuProps={menuProps}
            renderValue={selected => selected || "Gender"}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        <LocationFilter
          state={filters.state}
          onFilterChange={handleFilterChange}
          selectClassName={selectStyles}
        />

        <FormControl fullWidth size="small">
          <Select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            sx={selectStyles}
            MenuProps={menuProps}
          >
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
