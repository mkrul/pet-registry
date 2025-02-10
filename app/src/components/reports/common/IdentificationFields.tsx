import React from "react";
import {
  FormControl,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { getGenderOptions } from "../../../lib/reports/genderList";
import speciesListJson from "../../../../../config/species.json";
import BreedSearch from "../../common/BreedSearch";
import { AddFieldButton } from "../../common/AddFieldButton";
import { AdditionalFieldSet } from "../../common/AdditionalFieldSet";
import { IdentificationFieldsProps } from "../../../types/Report";
import { commonInputStyles } from "../../../styles/commonStyles";
import { FormFieldError } from "../../common/FormFieldError";

export const IdentificationFields: React.FC<IdentificationFieldsProps> = ({
  formData,
  showBreed2,
  onInputChange,
  setShowBreed2,
  onBreed2Remove,
  isLoading,
  error,
  breedError
}) => {
  const genderOptions = getGenderOptions();
  const speciesOptions = speciesListJson.options;

  const createChangeEvent = (name: string, value: string) =>
    ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;

  const handleFieldChange = (name: string) => (value: string) => {
    onInputChange(createChangeEvent(name, value));
  };

  const handleSpeciesChange = handleFieldChange("species");
  const handleBreedChange = handleFieldChange("breed1");
  const handleBreed2Change = handleFieldChange("breed2");
  const handleGenderChange = handleFieldChange("gender");

  const handleBreed2Remove = () => {
    onInputChange(createChangeEvent("breed2", ""));
    onBreed2Remove?.();
    setShowBreed2(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Microchip ID:</label>
        <span className="text-sm text-gray-500"> (Leave blank if not known)</span>
        <TextField
          data-testid="microchip-id-input"
          name="microchipId"
          value={formData.microchipId || ""}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          sx={commonInputStyles}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Gender:</label>{" "}
        <span className="text-sm text-gray-500"> (Leave blank if not known)</span>
        <FormControl fullWidth>
          <Select
            data-testid="gender-select"
            labelId="gender-label"
            id="gender"
            value={formData.gender || ""}
            onChange={e => handleGenderChange(e.target.value)}
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
            {genderOptions.map((gender, index) => (
              <MenuItem key={index} value={gender} data-testid="gender-option">
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">
          Is the animal spayed or neutered?
        </label>
        <div>
          <RadioGroup
            name="altered"
            value={formData.altered === null ? undefined : formData.altered.toString()}
            onChange={e => {
              console.log("Radio value changed to:", e.target.value);
              onInputChange(e);
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
            <FormControlLabel value="" control={<Radio />} label="I don't know" />
          </RadioGroup>
          <FormFieldError error={error} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Species:</label>
        <div>
          <TextField
            select
            name="species"
            value={formData.species || ""}
            onChange={onInputChange}
            variant="outlined"
            fullWidth
            required
            disabled={isLoading}
            sx={commonInputStyles}
            error={!!error}
          >
            {speciesOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <FormFieldError error={error} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Breed:</label>
        <div>
          <BreedSearch
            species={formData.species.toLowerCase() as "dog" | "cat"}
            value={formData.breed1}
            onChange={handleBreedChange}
            disabled={isLoading}
            excludeBreeds={formData.breed2 ? [formData.breed2] : []}
            required
            size="medium"
            hideLabel
            disableClearable
            error={!!breedError}
            data-testid="breed-search"
          />
          <FormFieldError error={breedError} />
        </div>

        {!showBreed2 && formData.breed1 && (
          <AddFieldButton
            onClick={() => setShowBreed2(true)}
            disabled={isLoading}
            label="ADD BREED"
            testId="add-breed-button"
          />
        )}
      </div>

      {showBreed2 && (
        <div className="mt-8">
          <div className="mb-6">
            <AdditionalFieldSet
              label="Second Breed:"
              onRemove={handleBreed2Remove}
              disabled={isLoading}
              testId="remove-breed-button"
            >
              <BreedSearch
                species={formData.species.toLowerCase() as "dog" | "cat"}
                value={formData.breed2 || ""}
                onChange={handleBreed2Change}
                disabled={isLoading}
                excludeBreeds={[formData.breed1]}
                size="medium"
                hideLabel
                disableClearable
              />
            </AdditionalFieldSet>
          </div>
        </div>
      )}
    </div>
  );
};
