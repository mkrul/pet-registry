import React, { useMemo } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import LocationFilter from "./LocationFilter";
import FilterWithClear from "../../../shared/components/common/FilterWithClear.jsx";
import speciesListJson from "../../../../../config/species.json";
import colorListJson from "../../../../../config/colors.json";
import sortOptionsJson from "../../../../../config/sort_options.json";
import { useTheme } from "../../../shared/hooks/useTheme.js";

const Filters = ({ filters, handleFilterChange, onReset, onClearFilter }) => {
  const { isDarkMode } = useTheme();

  const inputBackground = "rgba(29, 29, 29, 1)";
  const inputBorderLight = "rgba(75, 85, 99, 0.6)";
  const inputBorderDark = "rgba(55, 65, 81, 0.8)";

  const {
    selectSx,
    placeholderStyle,
    menuProps
  } = useMemo(() => {
    const selectTypography = {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontSize: "0.95rem",
      fontWeight: 400,
      lineHeight: "1.5rem"
    };

    return {
      selectSx: {
        "& .MuiSelect-select": {
          padding: "10px 14px",
          backgroundColor: inputBackground,
          borderRadius: "0.375rem",
          color: "rgb(255, 255, 255)",
          ...selectTypography
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDarkMode ? inputBorderDark : inputBorderLight
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(148, 163, 184, 0.8)"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.7)",
          borderWidth: "2px"
        },
        backgroundColor: inputBackground,
        borderRadius: "0.375rem"
      },
      placeholderStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        ...selectTypography
      },
      menuProps: {
        disableScrollLock: true,
        PaperProps: {
          sx: {
            maxHeight: 200,
            borderRadius: "0.5rem",
            border: isDarkMode ? "1px solid rgba(55, 65, 81, 1)" : "1px solid rgb(209, 213, 219)",
            backgroundColor: isDarkMode ? "rgba(17, 24, 39, 0.95)" : "white",
            "& .MuiMenuItem-root": {
              color: isDarkMode ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
              ...selectTypography,
              "&.Mui-selected": {
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: isDarkMode ? "rgb(147, 197, 253)" : "#1d4ed8"
              },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.25)"
              },
              "&:hover": {
                backgroundColor: isDarkMode ? "rgba(75, 85, 99, 0.5)" : "rgb(243, 244, 246)"
              }
            }
          }
        }
      }
    };
  }, [isDarkMode]);

  return (
    <div className="flex flex-col gap-2">
        <FilterWithClear
          hasValue={!!filters.species}
          onClear={() => onClearFilter('species')}
          label="Species"
          isDarkMode={isDarkMode}
        >
          <FormControl fullWidth size="small">
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
          <FormControl fullWidth size="small">
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
          <FormControl fullWidth size="small">
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

        <FormControl fullWidth size="small">
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
