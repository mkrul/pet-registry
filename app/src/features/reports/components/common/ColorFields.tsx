import React from "react";
import { FormControl, Select, MenuItem, SelectChangeEvent, IconButton, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ColorFieldsProps } from "../../../../shared/types/Report";
import { getColorOptions } from "../../../../shared/reports/colorList";
import { commonInputStyles } from "../../../../shared/commonStyles";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError";

export const ColorFields: React.FC<ColorFieldsProps> = ({
  formData,
  isLoading,
  handleColor1Change,
  handleColor2Change,
  handleColor3Change,
  error
}) => {
  const colorOptions = getColorOptions();

  const getFilteredColorOptions = (excludeColors: (string | null)[]) => {
    return colorOptions.filter(color => !excludeColors.includes(color));
  };

  const createChangeEvent = (name: string, value: string) =>
    ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;

  const handleColor1SelectChange = (e: SelectChangeEvent) => {
    handleColor1Change(e.target.value);
  };

  const handleColor2SelectChange = (e: SelectChangeEvent) => {
    handleColor2Change(e.target.value);
  };

  const handleColor3SelectChange = (e: SelectChangeEvent) => {
    handleColor3Change(e.target.value);
  };

  const handleRemoveColor2 = () => {
    handleColor2Change("");
  };

  const handleRemoveColor3 = () => {
    handleColor3Change("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">First Color:</label>
        <div className="flex-grow">
          <FormControl fullWidth>
            <Select
              data-testid="color1-select"
              labelId="color1-label"
              id="color1"
              value={formData.color1 || ""}
              onChange={handleColor1SelectChange}
              sx={commonInputStyles}
              disabled={isLoading}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              {getFilteredColorOptions([formData.color2, formData.color3].filter(Boolean)).map((color, index) => (
                <MenuItem key={index} value={color} data-testid="color1-option">
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormFieldError error={error} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Second Color:</label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <Select
              data-testid="color2-select"
              labelId="color2-label"
              id="color2"
              value={formData.color2 || ""}
              onChange={handleColor2SelectChange}
              sx={commonInputStyles}
              disabled={isLoading}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              {getFilteredColorOptions([formData.color1, formData.color3].filter(Boolean)).map((color, index) => (
                <MenuItem key={index} value={color} data-testid="color2-option">
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.color2 && (
            <IconButton
              onClick={handleRemoveColor2}
              disabled={isLoading}
              size="small"
              data-testid="remove-color2-button"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Third Color:</label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <Select
              data-testid="color3-select"
              labelId="color3-label"
              id="color3"
              value={formData.color3 || ""}
              onChange={handleColor3SelectChange}
              sx={commonInputStyles}
              disabled={isLoading}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              {getFilteredColorOptions([formData.color1, formData.color2].filter(Boolean)).map((color, index) => (
                <MenuItem key={index} value={color} data-testid="color3-option">
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.color3 && (
            <IconButton
              onClick={handleRemoveColor3}
              disabled={isLoading}
              size="small"
              data-testid="remove-color3-button"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </div>
    </div>
  );
};
