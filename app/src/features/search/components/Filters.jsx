import React from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import LocationFilter from "./LocationFilter";
import FilterWithClear from "../../../shared/components/common/FilterWithClear.jsx";
import speciesListJson from "../../../../../config/species.json";
import colorListJson from "../../../../../config/colors.json";
import sortOptionsJson from "../../../../../config/sort_options.json";

const Filters = ({ filters, handleFilterChange, onReset, onClearFilter }) => {
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
    <div className="flex flex-col gap-2">
        <FilterWithClear
          hasValue={!!filters.species}
          onClear={() => onClearFilter('species')}
          label="Species"
        >
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
        </FilterWithClear>

        <FilterWithClear
          hasValue={!!filters.color}
          onClear={() => onClearFilter('color')}
          label="Color"
        >
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
        </FilterWithClear>

        <FilterWithClear
          hasValue={!!filters.gender}
          onClear={() => onClearFilter('gender')}
          label="Gender"
        >
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
        </FilterWithClear>

        <FilterWithClear
          hasValue={!!filters.state}
          onClear={() => onClearFilter('state')}
          label="State"
        >
          <LocationFilter
            state={filters.state}
            onFilterChange={handleFilterChange}
            selectClassName={selectStyles}
          />
        </FilterWithClear>

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
  );
};

export default Filters;
