import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  SelectChangeEvent
} from "@mui/material";
import { getGenderOptions } from "../../../lib/reports/genderList";
import speciesListJson from "../../../../../config/species.json";
import BreedSearch from "../../common/BreedSearch";
import { AddFieldButton } from "../../common/AddFieldButton";
import { AdditionalFieldSet } from "../../common/AdditionalFieldSet";
import {
  IdentificationFieldsProps as BaseIdentificationFieldsProps,
  ReportPropsForm,
  FormInputEvent
} from "../../../types/Report";
import { commonInputStyles } from "../../../styles/commonStyles";
import { FormFieldError } from "../../common/FormFieldError";

interface Props {
  formData: ReportPropsForm;
  showBreed2: boolean;
  onInputChange: (e: FormInputEvent) => void;
  setShowBreed2: (show: boolean) => void;
  isLoading: boolean;
  error: string;
  breedError?: string;
  alteredError?: string;
  microchipError?: string;
}

export const IdentificationFields: React.FC<Props> = ({
  formData,
  showBreed2,
  onInputChange,
  setShowBreed2,
  isLoading,
  error,
  breedError,
  alteredError,
  microchipError
}) => {
  const [showSpeciesRequired, setShowSpeciesRequired] = useState(false);
  const genderOptions = getGenderOptions();
  const speciesOptions = speciesListJson.options;

  const createChangeEvent = (name: string, value: string) =>
    ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;

  const handleFieldChange = (name: string) => (value: string) => {
    onInputChange(createChangeEvent(name, value));
  };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSpeciesRequired(false);
    onInputChange(e);
  };

  const handleBreedChange = handleFieldChange("breed1");
  const handleBreed2Change = handleFieldChange("breed2");
  const handleGenderChange = handleFieldChange("gender");


  const handleBreedClick = () => {
    if (!formData.species) {
      setShowSpeciesRequired(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Microchip ID:</label>
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
          error={!!microchipError}
        />
        <FormFieldError error={microchipError} />
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
            onChange={(e: SelectChangeEvent) => handleGenderChange(e.target.value)}
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
            name="isAltered"
            value={formData.isAltered}
            onChange={e => {
              const value = e.target.value === "true" ? true : e.target.value === "false" ? false : null;
              onInputChange({
                target: { name: "isAltered", value }
              });
            }}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
            <FormControlLabel value={null} control={<Radio />} label="I don't know" />
          </RadioGroup>
          <FormFieldError error={alteredError} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Species:</label>
        <div>
          <TextField
            select
            name="species"
            value={formData.species?.toLowerCase()}
            onChange={handleSpeciesChange}
            variant="outlined"
            fullWidth
            required
            disabled={isLoading}
            sx={commonInputStyles}
            error={!!error}
          >
            {speciesOptions.map(option => (
              <MenuItem key={option} value={option.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <FormFieldError error={error} />
          {showSpeciesRequired && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Please select a species first
            </Alert>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Breed:</label>
        <div className="space-y-2">
          <div className={showBreed2 ? "mb-6" : ""}>
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
              onEmptySpeciesClick={() => setShowSpeciesRequired(true)}
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

          {showBreed2 && (
            <AdditionalFieldSet
              label="Second Breed:"
              show={showBreed2}
            >
              <BreedSearch
                species={formData.species.toLowerCase() as "dog" | "cat"}
                value={formData.breed2}
                onChange={handleBreed2Change}
                disabled={isLoading}
                excludeBreeds={[formData.breed1]}
                size="medium"
                hideLabel
              />
            </AdditionalFieldSet>
          )}
        </div>
      </div>
    </div>
  );
};
