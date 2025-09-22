import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetStatesQuery } from "../../../store/features/reports/reportsApi.js";
import { SelectChangeEvent } from "@mui/material";

const LocationSelect = ({
  state,
  onFilterChange,
  selectClassName
}) => {
  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery("United States", {
    skip: false
  });

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200
      }
    },
    disableScrollLock: true
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        name="state"
        value={state}
        onChange={onFilterChange}
        disabled={isLoadingStates}
        displayEmpty
        sx={selectClassName}
        MenuProps={menuProps}
        renderValue={value => value || "State"}
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
