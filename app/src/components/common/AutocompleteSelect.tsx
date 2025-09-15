import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import { SxProps } from "@mui/material";

interface AutocompleteSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  sx?: SxProps;
  size?: "small" | "medium";
}

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  sx,
  size = "small"
}) => {
  const handleChange = (_: any, newValue: string | null) => {
    onChange({
      target: { name, value: newValue || "" }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <FormControl fullWidth size={size}>
      <Autocomplete
        value={value}
        onChange={handleChange}
        options={options}
        disabled={disabled}
        size={size}
        clearable
        slotProps={{
          listbox: {
            style: { maxHeight: 200 }
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            size={size}
            sx={sx}
          />
        )}
      />
    </FormControl>
  );
};

export default AutocompleteSelect;
