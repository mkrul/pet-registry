import React from "react";
import { FormControl, Select, MenuItem, IconButton, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getColorOptions } from "../../../../shared/reports/colorList";
import { commonInputStyles } from "../../../../shared/commonStyles";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";

export const PetColorFields = ({
  formData,
  isLoading,
  handleColor1Change,
  handleColor2Change,
  handleColor3Change,
  error,
  dashboard = false
}) => {
  const colorOptions = getColorOptions();

  const getFilteredColorOptions = (excludeColors) => {
    return colorOptions.filter(color => !excludeColors.includes(color));
  };

  const createChangeEvent = (name, value) =>
    ({
      target: { name, value }
    });

  const handleColor1SelectChange = (e) => {
    handleColor1Change(e.target.value);
  };

  const handleColor2SelectChange = (e) => {
    handleColor2Change(e.target.value);
  };

  const handleColor3SelectChange = (e) => {
    handleColor3Change(e.target.value);
  };

  const handleRemoveColor2 = () => {
    handleColor2Change("");
  };

  const handleRemoveColor3 = () => {
    handleColor3Change("");
  };

  if (dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="color1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Color
          </label>
          <select
            id="color1"
            data-testid="color1-select"
            value={formData.color1 || ""}
            onChange={handleColor1SelectChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select color</option>
            {getFilteredColorOptions([formData.color2, formData.color3].filter(Boolean)).map((color, index) => (
              <option key={index} value={color} data-testid="color1-option">
                {color}
              </option>
            ))}
          </select>
          <FormFieldError error={error} />
        </div>

        <div>
          <label htmlFor="color2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Second Color
          </label>
          <div className="flex items-center gap-2">
            <select
              id="color2"
              data-testid="color2-select"
              value={formData.color2 || ""}
              onChange={handleColor2SelectChange}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select color</option>
              {getFilteredColorOptions([formData.color1, formData.color3].filter(Boolean)).map((color, index) => (
                <option key={index} value={color} data-testid="color2-option">
                  {color}
                </option>
              ))}
            </select>
            {formData.color2 && (
              <button
                type="button"
                onClick={handleRemoveColor2}
                disabled={isLoading}
                data-testid="remove-color2-button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear second color"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="color3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Third Color
          </label>
          <div className="flex items-center gap-2">
            <select
              id="color3"
              data-testid="color3-select"
              value={formData.color3 || ""}
              onChange={handleColor3SelectChange}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select color</option>
              {getFilteredColorOptions([formData.color1, formData.color2].filter(Boolean)).map((color, index) => (
                <option key={index} value={color} data-testid="color3-option">
                  {color}
                </option>
              ))}
            </select>
            {formData.color3 && (
              <button
                type="button"
                onClick={handleRemoveColor3}
                disabled={isLoading}
                data-testid="remove-color3-button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear third color"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">First Color:</label>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Second Color:</label>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Third Color:</label>
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
