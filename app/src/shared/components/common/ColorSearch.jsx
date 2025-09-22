import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { getColorOptions } from "../../reports/colorList";

export const ColorSearch = ({
  value,
  onChange,
  excludeColors = [],
  disabled = false,
  size = "small",
  sx,
  required = false,
  error = false
}) => {
  const colorOptions = React.useMemo(() => {
    const colors = getColorOptions();
    return colors.filter(color => !excludeColors.includes(color));
  }, [excludeColors]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue || "")}
      options={colorOptions}
      disabled={disabled}
      size={size}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          variant="outlined"
          size={size}
          sx={sx}
          error={error}
        />
      )}
    />
  );
};
