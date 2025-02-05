import React from "react";
import { ColorFieldsProps } from "../../../types/Report";
import { AddFieldButton } from "../../common/AddFieldButton";
import { AdditionalFieldSet } from "../../common/AdditionalFieldSet";
import { ColorSearch } from "../../common/ColorSearch";

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
  const handleColorChange = (value: string) => {
    onInputChange({ target: { name: "color1", value } });
  };

  const handleColor2Change = (value: string) => {
    onInputChange({ target: { name: "color2", value } });
  };

  const handleColor3Change = (value: string) => {
    onInputChange({ target: { name: "color3", value } });
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
      <div className="space-y-6">
        <div className="flex-grow">
          <ColorSearch
            value={formData.color1}
            onChange={handleColorChange}
            disabled={isLoading}
            size="medium"
            excludeColors={[formData.color2, formData.color3].filter(Boolean)}
          />
        </div>

        {!showColor2 && formData.color1 && (
          <AddFieldButton
            onClick={() => setShowColor2(true)}
            disabled={isLoading}
            label="ADD COLOR"
            testId="add-color-button"
          />
        )}

        {showColor2 && (
          <AdditionalFieldSet
            label="Second Color"
            onRemove={() => {
              onInputChange({ target: { name: "color2", value: null } });
              onColor2Remove?.();
              setShowColor2(false);
            }}
            disabled={isLoading}
            testId="remove-color-button"
          >
            <ColorSearch
              value={formData.color2 || ""}
              onChange={handleColor2Change}
              disabled={isLoading}
              size="medium"
              excludeColors={[formData.color1, formData.color3].filter(Boolean)}
            />
          </AdditionalFieldSet>
        )}

        {showColor2 && !showColor3 && formData.color2 && (
          <AddFieldButton
            onClick={() => setShowColor3(true)}
            disabled={isLoading}
            label="ADD COLOR"
            testId="add-color-button"
          />
        )}

        {showColor3 && (
          <AdditionalFieldSet
            label="Third Color"
            onRemove={() => {
              onInputChange({ target: { name: "color3", value: null } });
              onColor3Remove?.();
              setShowColor3(false);
            }}
            disabled={isLoading}
            testId="remove-color-button"
          >
            <ColorSearch
              value={formData.color3 || ""}
              onChange={handleColor3Change}
              disabled={isLoading}
              size="medium"
              excludeColors={[formData.color1, formData.color2].filter(Boolean)}
            />
          </AdditionalFieldSet>
        )}
      </div>
    </div>
  );
};
