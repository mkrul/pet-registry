import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";
import { SelectChangeEvent } from "@mui/material";

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onFilterChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  selectClassName: any;
  disabledSelectClassName: any;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  country,
  state,
  city,
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

  const handleCountryChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    // First reset dependent fields
    onFilterChange({ target: { name: "state", value: "" } } as SelectChangeEvent<string>, null);
    onFilterChange({ target: { name: "city", value: "" } } as SelectChangeEvent<string>, null);
    // Then update country
    onFilterChange(event, child);
  };

  const handleStateChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    onFilterChange(event, child);
    if (city) {
      onFilterChange({ target: { name: "city", value: "" } } as SelectChangeEvent<string>, null);
    }
  };

  return (
    <>
      <FormControl fullWidth size="small">
        <Select
          name="city"
          value={city}
          onChange={onFilterChange}
          disabled={!country || !state || isLoadingCities}
          displayEmpty
          sx={{
            ...selectClassName,
            backgroundColor: "white !important",
            "& .MuiSelect-select": {
              backgroundColor: "white !important"
            }
          }}
          renderValue={value => value || "City"}
        >
          <MenuItem value="">City</MenuItem>
          {cities.map(city => (
            <MenuItem key={city} value={city}>
              {city}
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
          sx={selectClassName}
          renderValue={value => value || "State"}
        >
          <MenuItem value="">State</MenuItem>
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
          onChange={handleCountryChange}
          displayEmpty
          sx={selectClassName}
          renderValue={value => value || "Country"}
        >
          <MenuItem value="">Country</MenuItem>
          <MenuItem value="United States">United States</MenuItem>
          <MenuItem value="Canada">Canada</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default LocationSelect;
