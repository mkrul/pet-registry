import React from "react";
import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { ColorFieldsProps } from "../../../types/Report";
import { AddFieldButton } from "../../common/AddFieldButton";
import { AdditionalFieldSet } from "../../common/AdditionalFieldSet";
import { getColorOptions } from "../../../lib/reports/colorList";
import { commonInputStyles } from "../../../styles/commonStyles";
import { FormFieldError } from "../../common/FormFieldError";

export const ColorFields: React.FC<ColorFieldsProps> = ({
  formData,
  showColor2,
  showColor3,
  setShowColor2,
  setShowColor3,
  onColor2Add,
  onColor3Add,
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Colors:</label>
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

        {!showColor2 && formData.color1 && (
          <AddFieldButton
            onClick={() => setShowColor2(true)}
            disabled={isLoading}
            label="ADD COLOR"
            testId="add-color-button"
          />
        )}
      </div>

      {showColor2 && (
        <div className="space-y-2">
          <AdditionalFieldSet
            label="Second Color:"
          >
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
          </AdditionalFieldSet>

          {!showColor3 && formData.color2 && (
            <AddFieldButton
              onClick={() => setShowColor3(true)}
              disabled={isLoading}
              label="ADD COLOR"
              testId="add-color-button"
            />
          )}
        </div>
      )}

      {showColor3 && (
        <div className="space-y-2">
          <AdditionalFieldSet
            label="Third Color:"
          >
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
          </AdditionalFieldSet>
        </div>
      )}
    </div>
  );
};
