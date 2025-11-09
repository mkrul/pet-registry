import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getColorOptions } from "../../../../shared/reports/colorList.js";
import { commonInputStyles } from "../../../../shared/commonStyles.js";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";
import { useTheme } from "../../../../shared/contexts/ThemeContext";

export const ColorFields = ({
  formData,
  isLoading,
  handleColor1Change,
  handleColor2Change,
  handleColor3Change,
  error,
  dashboard = false
}) => {
  const { isDarkMode } = useTheme();
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
    const selectTypography = {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem'
    };

    const dashboardSelectSx = {
      '& .MuiSelect-select': {
        padding: '12px 14px',
        backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1)' : 'white',
        borderRadius: '0.375rem',
        color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
        ...selectTypography
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(29, 29, 29, 1)' : 'rgb(209, 213, 219)'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(29, 29, 29, 1)' : 'rgb(156, 163, 175)'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: '2px'
      },
      backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1)' : 'white',
      borderRadius: '0.375rem'
    };

    const placeholderStyle = {
      color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
      ...selectTypography
    };

    const dashboardMenuProps = {
      PaperProps: {
        sx: {
          borderRadius: '0.375rem',
          border: isDarkMode ? '1px solid rgba(29, 29, 29, 1)' : '1px solid rgb(209, 213, 219)',
          backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1)' : 'white',
          '& .MuiMenuItem-root': {
            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
            ...selectTypography,
            '&.Mui-selected': {
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: isDarkMode ? 'rgb(147, 197, 253)' : '#1d4ed8'
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.2)'
            },
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgb(243, 244, 246)'
            }
          }
        }
      }
    };

    const renderValue = (value, placeholder) =>
      value ? value : <span style={placeholderStyle}>{placeholder}</span>;

    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="color1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Color
          </label>
          <FormControl fullWidth>
            <Select
              id="color1"
              data-testid="color1-select"
              value={formData.color1 || ""}
              onChange={handleColor1SelectChange}
              disabled={isLoading}
              displayEmpty
              sx={dashboardSelectSx}
              MenuProps={dashboardMenuProps}
              renderValue={(selected) => renderValue(selected, "Select color")}
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

        <div>
          <label htmlFor="color2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Second Color
          </label>
          <div className="flex items-center gap-2">
            <FormControl fullWidth>
              <Select
                id="color2"
                data-testid="color2-select"
                value={formData.color2 || ""}
                onChange={handleColor2SelectChange}
                disabled={isLoading}
                displayEmpty
                sx={dashboardSelectSx}
                MenuProps={dashboardMenuProps}
                renderValue={(selected) => renderValue(selected, "Select color")}
              >
                {getFilteredColorOptions([formData.color1, formData.color3].filter(Boolean)).map((color, index) => (
                  <MenuItem key={index} value={color} data-testid="color2-option">
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl fullWidth>
              <Select
                id="color3"
                data-testid="color3-select"
                value={formData.color3 || ""}
                onChange={handleColor3SelectChange}
                disabled={isLoading}
                displayEmpty
                sx={dashboardSelectSx}
                MenuProps={dashboardMenuProps}
                renderValue={(selected) => renderValue(selected, "Select color")}
              >
                {getFilteredColorOptions([formData.color1, formData.color2].filter(Boolean)).map((color, index) => (
                  <MenuItem key={index} value={color} data-testid="color3-option">
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
