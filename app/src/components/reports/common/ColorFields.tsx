import React from "react";
import { ColorFieldsProps } from "../../../types/Report";
import { AddFieldButton } from "../../common/AddFieldButton";
import { AdditionalFieldSet } from "../../common/AdditionalFieldSet";
import { ColorSearch } from "../../common/ColorSearch";
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
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Colors:</label>
        <div className="flex-grow">
          <ColorSearch
            value={formData.color1}
            onChange={handleColor1Change}
            disabled={isLoading}
            size="medium"
            excludeColors={[formData.color2, formData.color3].filter(Boolean)}
            sx={commonInputStyles}
            required
            error={!!error}
          />
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
            <ColorSearch
              value={formData.color2 || ""}
              onChange={handleColor2Change}
              disabled={isLoading}
              size="medium"
              excludeColors={[formData.color1, formData.color3].filter(Boolean)}
              sx={commonInputStyles}
            />
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
            <ColorSearch
              value={formData.color3 || ""}
              onChange={handleColor3Change}
              disabled={isLoading}
              size="medium"
              excludeColors={[formData.color1, formData.color2].filter(Boolean)}
              sx={commonInputStyles}
            />
          </AdditionalFieldSet>
        </div>
      )}
    </div>
  );
};
