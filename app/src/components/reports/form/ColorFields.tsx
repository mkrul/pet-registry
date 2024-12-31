import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { getColorOptions } from "../../../lib/reports/colorList";
import { Close as CloseIcon } from "@mui/icons-material";
import { ColorFieldsProps } from "../../../types/Report";

export const ColorFields: React.FC<ColorFieldsProps> = ({
  formData,
  showColor2,
  showColor3,
  onInputChange,
  onShowColor2Change,
  onShowColor3Change,
  isLoading
}) => {
  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    const validSelectedColors = selectedColors.filter(
      (color): color is string => color !== null && color !== ""
    );
    return getColorOptions().filter(color => !validSelectedColors.includes(color));
  };

  const commonSelectStyles = {
    backgroundColor: "white",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white"
    },
    "& .MuiSelect-select": {
      backgroundColor: "white"
    },
    "& .MuiPaper-root": {
      maxHeight: "12rem"
    }
  };

  const menuProps = {
    PaperProps: {
      style: { maxHeight: "12rem" }
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (value) {
      if (name === "color1") {
        // First clear any duplicates
        if (value === formData.color2) {
          onInputChange({ target: { name: "color2", value: null } });
          onShowColor2Change(false); // Also hide the field
        }
        if (value === formData.color3) {
          onInputChange({ target: { name: "color3", value: null } });
          onShowColor3Change(false); // Also hide the field
        }
        // Then update color1
        onInputChange(e);
      } else if (name === "color2") {
        if (value === formData.color1) {
          return; // Don't allow color2 to match color1
        }
        if (value === formData.color3) {
          onInputChange({ target: { name: "color3", value: null } });
          onShowColor3Change(false); // Also hide the field
        }
        onInputChange(e);
      } else if (name === "color3") {
        if (value === formData.color1 || value === formData.color2) {
          return; // Don't allow color3 to match color1 or color2
        }
        onInputChange(e);
      }
    } else {
      onInputChange(e);
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="color1-label">Color 1</InputLabel>
        <Select
          labelId="color1-label"
          id="color1"
          name="color1"
          value={formData.color1}
          onChange={handleInputChange}
          label="Color 1"
          sx={commonSelectStyles}
          MenuProps={menuProps}
        >
          {getColorOptions().map((color, index) => (
            <MenuItem key={`${color}-${index}`} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!showColor2 && formData.color1 && (
        <Button
          onClick={() => onShowColor2Change(true)}
          disabled={isLoading}
          color="primary"
          variant="text"
          className="mt-2"
        >
          + ADD ANOTHER COLOR
        </Button>
      )}

      {showColor2 && (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <InputLabel id="color2-label">Color 2</InputLabel>
            <Select
              labelId="color2-label"
              id="color2"
              name="color2"
              value={formData.color2 || ""}
              onChange={handleInputChange}
              label="Color 2"
              sx={commonSelectStyles}
              MenuProps={menuProps}
            >
              {getFilteredColorOptions([formData.color1]).map((color, index) => (
                <MenuItem key={`${color}-${index}`} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button
            type="button"
            onClick={() => onShowColor2Change(false)}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Color 2"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}

      {showColor2 && !showColor3 && formData.color2 && (
        <Button
          onClick={() => onShowColor3Change(true)}
          disabled={isLoading}
          color="primary"
          variant="text"
          className="mt-2"
        >
          + ADD ANOTHER COLOR
        </Button>
      )}

      {showColor3 && (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <InputLabel id="color3-label">Color 3</InputLabel>
            <Select
              labelId="color3-label"
              id="color3"
              name="color3"
              value={formData.color3 || ""}
              onChange={handleInputChange}
              label="Color 3"
              sx={commonSelectStyles}
              MenuProps={menuProps}
            >
              {getFilteredColorOptions([formData.color1, formData.color2]).map((color, index) => (
                <MenuItem key={`${color}-${index}`} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button
            type="button"
            onClick={() => onShowColor3Change(false)}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Color 3"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}
    </>
  );
};
