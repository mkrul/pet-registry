import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
          onChange={onFilterChange}
          disabled={!country || isLoadingStates}
          displayEmpty
          sx={selectClassName}
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
          onChange={onFilterChange}
          displayEmpty
          sx={selectClassName}
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
