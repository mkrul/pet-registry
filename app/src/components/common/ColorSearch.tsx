import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { getColorOptions } from "../../lib/reports/colorList";

interface ColorSearchProps {
  value: string;
  onChange: (value: string) => void;
  excludeColors?: (string | null)[];
  disabled?: boolean;
  size?: "small" | "medium";
}

export const ColorSearch: React.FC<ColorSearchProps> = ({
  value,
  onChange,
  excludeColors = [],
  disabled = false,
  size = "small"
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
      renderInput={params => <TextField {...params} variant="outlined" size={size} />}
    />
  );
};
