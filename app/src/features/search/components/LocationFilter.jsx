import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetStatesQuery } from "../../../store/features/reports/reportsApi.js";

const LocationSelect = ({
  state,
  onFilterChange,
  selectSx,
  menuProps,
  placeholderStyle
}) => {
  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery("United States", {
    skip: false
  });

  return (
    <FormControl fullWidth>
      <Select
        name="state"
        value={state}
        onChange={onFilterChange}
        disabled={isLoadingStates}
        displayEmpty
        sx={selectSx}
        MenuProps={menuProps}
        renderValue={value =>
          value ? value : <span style={placeholderStyle}>State</span>
        }
      >
        {states.map(state => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationSelect;
