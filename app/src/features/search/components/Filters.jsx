import React, { useMemo } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import LocationFilter from "./LocationFilter";
import FilterWithClear from "../../../shared/components/common/FilterWithClear.jsx";
import speciesListJson from "../../../../../config/species.json";
import colorListJson from "../../../../../config/colors.json";
import sortOptionsJson from "../../../../../config/sort_options.json";
import { useTheme } from "../../../shared/hooks/useTheme.js";
import { getDashboardSelectConfig } from "../../../shared/commonStyles";

const Filters = ({ filters, handleFilterChange, onReset, onClearFilter }) => {
  const { isDarkMode } = useTheme();

  const {
    selectSx,
    placeholderStyle,
    menuProps: baseMenuProps
  } = useMemo(
    () => getDashboardSelectConfig(isDarkMode),
    [isDarkMode]
  );

  const menuProps = useMemo(
    () => ({
      ...baseMenuProps,
      disableScrollLock: true
    }),
    [baseMenuProps]
  );

  return (
    <div className="flex flex-col gap-2">
        <FilterWithClear
          hasValue={!!filters.species}
          onClear={() => onClearFilter('species')}
          label="Species"
          isDarkMode={isDarkMode}
        >
          <FormControl fullWidth>
            <Select
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              displayEmpty
              sx={selectSx}
              MenuProps={menuProps}
              renderValue={selected =>
                selected ? (
                  selected
                ) : (
                  <span style={placeholderStyle}>Species</span>
                )
              }
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
          isDarkMode={isDarkMode}
        >
          <FormControl fullWidth>
            <Select
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
              displayEmpty
              sx={selectSx}
              MenuProps={menuProps}
              renderValue={selected =>
                selected ? (
                  selected
                ) : (
                  <span style={placeholderStyle}>Color</span>
                )
              }
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
          isDarkMode={isDarkMode}
        >
          <FormControl fullWidth>
            <Select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              displayEmpty
              sx={selectSx}
              MenuProps={menuProps}
              renderValue={selected =>
                selected ? (
                  selected
                ) : (
                  <span style={placeholderStyle}>Gender</span>
                )
              }
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
          isDarkMode={isDarkMode}
        >
          <LocationFilter
            state={filters.state}
            onFilterChange={handleFilterChange}
            selectSx={selectSx}
            menuProps={menuProps}
            placeholderStyle={placeholderStyle}
          />
        </FilterWithClear>

        <FormControl fullWidth>
          <Select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            sx={selectSx}
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
