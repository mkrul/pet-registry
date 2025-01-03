import React from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import BreedSearch from "../common/BreedSearch";
import LocationFilter from "../search/LocationFilter";
import speciesListJson from "../../../../config/species.json";
import colorListJson from "../../../../config/colors.json";
import genderListJson from "../../../../config/genders.json";
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

  return (
    <div className="p-4" data-testid="filters-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormControl fullWidth size="small" data-testid="species-select-container">
          <Select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            displayEmpty
            sx={selectStyles}
            renderValue={selected => selected || "Species"}
            data-testid="species-select"
          >
            {speciesListJson.options.map((species, index) => (
              <MenuItem
                key={`${species}-${index}`}
                value={species}
                data-testid={`species-select-option-${species}`}
              >
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <BreedSearch
          data-testid="breed-search"
          species={filters.species as Species | ""}
          value={filters.breed}
          onChange={(value: string) =>
            handleFilterChange({
              target: { name: "breed", value }
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        />

        <FormControl fullWidth size="small" data-testid="color-select-container">
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
            data-testid="color-select"
          >
            {colorListJson.options.map((color, index) => (
              <MenuItem
                key={`${color}-${index}`}
                value={color}
                data-testid={`color-select-option-${color}`}
              >
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" data-testid="gender-select-container">
          <Select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            displayEmpty
            sx={selectStyles}
            renderValue={selected => selected || "Gender"}
            data-testid="gender-select"
          >
            {genderListJson.options.map((gender, index) => (
              <MenuItem
                key={`${gender}-${index}`}
                value={gender}
                data-testid={`gender-select-option-${gender}`}
              >
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocationFilter
          country={filters.country}
          state={filters.state}
          area={filters.area}
          onFilterChange={handleFilterChange}
          selectClassName={selectStyles}
          disabledSelectClassName={selectStyles}
        />

        <FormControl fullWidth size="small" data-testid="sort-select-container">
          <Select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            sx={selectStyles}
            data-testid="sort-select"
          >
            <MenuItem value="Newest">Newest</MenuItem>
            {sortOptionsJson.options
              .filter(option => option !== "Newest")
              .map(option => (
                <MenuItem key={option} value={option} data-testid={`sort-select-option-${option}`}>
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
