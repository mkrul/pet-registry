import React from "react";
import { FormControl, Select, MenuItem, Button } from "@mui/material";
import { getColorOptions } from "../../../lib/reports/colorList";
import { Close as CloseIcon } from "@mui/icons-material";
import { ColorFieldsProps } from "../../../types/Report";
import { commonInputStyles } from "../../../styles/commonStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const ColorFields: React.FC<ColorFieldsProps> = ({
  formData,
  showColor2,
  showColor3,
  onInputChange,
  setShowColor2,
  setShowColor3,
  onColor2Add,
  onColor3Add,
  onColor2Remove,
  onColor3Remove,
  isLoading
}) => {
  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    const validSelectedColors = selectedColors.filter(
      (color): color is string => color !== null && color !== ""
    );
    return getColorOptions().filter(color => !validSelectedColors.includes(color));
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200
      }
    }
  };

  const createChangeEvent = (name: string, value: string | null) =>
    ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;

  const handleColorConflict = (value: string) => {
    if (value === formData.color2) {
      onInputChange(createChangeEvent("color2", null));
      setShowColor2(false);
    }
    if (value === formData.color3) {
      onInputChange(createChangeEvent("color3", null));
      setShowColor3(false);
    }
  };

  const handleColorChange = (e: any) => {
    handleColorConflict(e.target.value);
    onInputChange(e);
  };

  const handleColor2Change = (e: any) => {
    const { value } = e.target;
    if (value === formData.color1) return;
    if (value === formData.color3) {
      onInputChange(createChangeEvent("color3", null));
      setShowColor3(false);
    }
    onInputChange(e);
  };

  const handleColor3Change = (e: any) => {
    if (e.target.value === formData.color1 || e.target.value === formData.color2) return;
    onInputChange(e);
  };

  const handleColor2Remove = () => {
    onInputChange({ target: { name: "color2", value: null } });
    onColor2Remove?.();
    setShowColor2(false);
  };

  const handleColor3Remove = () => {
    onInputChange({ target: { name: "color3", value: null } });
    onColor3Remove?.();
    setShowColor3(false);
  };

  const handleShowColor2Change = (show: boolean) => {
    if (show) {
      onColor2Add?.();
    } else {
      handleColor2Remove();
    }
    setShowColor2(show);
  };

  const handleShowColor3Change = (show: boolean) => {
    if (show) {
      onColor3Add?.();
    } else {
      handleColor3Remove();
    }
    setShowColor3(show);
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
      <div className="space-y-6">
        <div className="flex-grow">
          <FormControl fullWidth>
            <Select
              labelId="color1-label"
              id="color1"
              name="color1"
              value={formData.color1}
              onChange={handleColorChange}
              sx={commonInputStyles}
              MenuProps={menuProps}
            >
              {getColorOptions().map((color, index) => (
                <MenuItem key={`${color}-${index}`} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {!showColor2 && formData.color1 && (
          <Button
            onClick={() => handleShowColor2Change(true)}
            disabled={isLoading}
            color="primary"
            variant="text"
            className="mt-2"
            sx={commonInputStyles}
            data-testid="add-color-button"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2 mb-[3px]" />
              <span>ADD COLOR</span>
            </div>
          </Button>
        )}

        {showColor2 && (
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2 mt-2">Second Color:</label>
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <FormControl fullWidth>
                  <Select
                    labelId="color2-label"
                    id="color2"
                    name="color2"
                    value={formData.color2 || ""}
                    onChange={handleColor2Change}
                    sx={commonInputStyles}
                    MenuProps={menuProps}
                  >
                    {getFilteredColorOptions([formData.color1]).map((color, index) => (
                      <MenuItem key={`${color}-${index}`} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button
                type="button"
                onClick={handleColor2Remove}
                disabled={isLoading}
                color="error"
                variant="text"
                startIcon={<CloseIcon fontSize="medium" />}
                aria-label="Remove Color 2"
                sx={commonInputStyles}
                data-testid="remove-color-button"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {showColor2 && !showColor3 && formData.color2 && (
          <Button
            onClick={() => handleShowColor3Change(true)}
            disabled={isLoading}
            color="primary"
            variant="text"
            className="mt-2"
            sx={commonInputStyles}
            data-testid="add-color-button"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2 mb-[3px]" />
              <span>ADD COLOR</span>
            </div>
          </Button>
        )}

        {showColor3 && (
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2 mt-2">Third Color:</label>
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <FormControl fullWidth>
                  <Select
                    labelId="color3-label"
                    id="color3"
                    name="color3"
                    value={formData.color3 || ""}
                    onChange={handleColor3Change}
                    sx={commonInputStyles}
                    MenuProps={menuProps}
                  >
                    {getFilteredColorOptions([formData.color1, formData.color2]).map(
                      (color, index) => (
                        <MenuItem key={`${color}-${index}`} value={color}>
                          {color}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </div>
              <Button
                type="button"
                onClick={handleColor3Remove}
                disabled={isLoading}
                color="error"
                variant="text"
                startIcon={<CloseIcon fontSize="medium" />}
                aria-label="Remove Color 3"
                sx={commonInputStyles}
                data-testid="remove-color-button"
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
