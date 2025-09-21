import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { getColorOptions } from "../../reports/colorList";
import { SxProps } from "@mui/material";

interface ColorSearchProps {
  value: string;
  onChange: (color: string) => void;
  excludeColors?: (string | null)[];
  disabled?: boolean;
  size?: "small" | "medium";
  sx?: SxProps;
  required?: boolean;
  hideLabel?: boolean;
  disableClearable?: boolean;
  error?: boolean;
}

export const ColorSearch: React.FC<ColorSearchProps> = ({
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
