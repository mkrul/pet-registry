import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";
import { SelectChangeEvent } from "@mui/material";
import { LocationFilterProps } from "../../types/common/Search";

const LocationSelect: React.FC<LocationFilterProps> = ({
  country,
  state,
  area,
  onFilterChange,
  selectClassName
}) => {
  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery(country, {
    skip: !country
  });

  const { data: cities = [], isLoading: isLoadingCities } = useGetCitiesQuery(
    { country, state },
    { skip: !country || !state }
  );

  const handleStateChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    onFilterChange(event, child);
    if (area) {
      onFilterChange({ target: { name: "area", value: "" } } as SelectChangeEvent<string>, null);
    }
  };

  return (
    <>
      <FormControl fullWidth size="small">
        <Select
          name="area"
          value={area}
          onChange={onFilterChange}
          disabled={!country || !state || isLoadingCities}
          displayEmpty
          sx={{
            ...selectClassName,
            backgroundColor: "white !important",
            "& .MuiSelect-select": {
              backgroundColor: "white !important"
            },
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
          renderValue={value => value || "Area"}
        >
          {cities.map(area => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <Select
          name="state"
          value={state}
          onChange={handleStateChange}
          disabled={!country || isLoadingStates}
          displayEmpty
          sx={{
            ...selectClassName,
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
          renderValue={value => value || "State"}
        >
          {states.map(state => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <Select
          name="country"
          value={country}
          onChange={onFilterChange}
          displayEmpty
          sx={{
            ...selectClassName,
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
          renderValue={selected => selected || "Country"}
        >
          <MenuItem value="United States">United States</MenuItem>
          <MenuItem value="United States">United States</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default LocationSelect;
