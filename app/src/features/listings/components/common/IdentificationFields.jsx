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
  IconButton,
  Box
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getGenderOptions } from "../../../../shared/reports/genderList.js";
import speciesListJson from "../../../../../../config/species.json";
import BreedSearch from "../../../../shared/components/common/BreedSearch.jsx";
import { commonInputStyles } from "../../../../shared/commonStyles.js";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";

const IdentificationFields = ({
  formData,
  onInputChange,
  isLoading,
  error,
  breedError,
  alteredError,
  microchipError
}) => {
  const [showSpeciesRequired, setShowSpeciesRequired] = useState(false);
  const genderOptions = getGenderOptions();
  const speciesOptions = speciesListJson.options;

  const createChangeEvent = (name, value) =>
    ({
      target: { name, value }
    });

  const handleFieldChange = (name) => (value) => {
    onInputChange(createChangeEvent(name, value));
  };

  const handleSpeciesChange = (e) => {
    setShowSpeciesRequired(false);
    onInputChange(e);
  };

  const handleBreedChange = handleFieldChange("breed1");
  const handleBreed2Change = handleFieldChange("breed2");
  const handleGenderChange = handleFieldChange("gender");

  const handleClearGender = () => {
    onInputChange(createChangeEvent("gender", ""));
  };

  const handleClearBreed1 = () => {
    onInputChange(createChangeEvent("breed1", ""));
  };

  const handleClearBreed2 = () => {
    onInputChange(createChangeEvent("breed2", ""));
  };


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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <Select
              data-testid="gender-select"
              labelId="gender-label"
              id="gender"
              value={formData.gender || ""}
              onChange={(e) => handleGenderChange(e.target.value)}
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
          {formData.gender && (
            <IconButton
              onClick={handleClearGender}
              disabled={isLoading}
              size="small"
              data-testid="remove-gender-button"
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
        <label className="text-lg font-medium text-gray-900">
          Is the animal spayed or neutered?
        </label>
        <div>
          <RadioGroup
            name="isAltered"
            value={formData.isAltered === null ? "" : formData.isAltered}
            onChange={e => {
              const value = e.target.value === "true" ? true : e.target.value === "false" ? false : null;
              onInputChange({
                target: { name: "isAltered", value }
              });
            }}
            disabled={isLoading}
          >
            <FormControlLabel value={true} control={<Radio disabled={isLoading} />} label="Yes" />
            <FormControlLabel value={false} control={<Radio disabled={isLoading} />} label="No" />
            <FormControlLabel value="" control={<Radio disabled={isLoading} />} label="I don't know" />
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
        <label className="text-lg font-medium text-gray-900">First Breed:</label>
        <div className="space-y-2">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BreedSearch
              species={formData.species.toLowerCase()}
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
              showBreedPlaceholder={false}
              data-testid="breed-search"
            />
            {formData.breed1 && (
              <IconButton
                onClick={handleClearBreed1}
                disabled={isLoading}
                size="small"
                data-testid="remove-breed1-button"
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
          <FormFieldError error={breedError} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Second Breed:</label>
        <div className="space-y-2">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BreedSearch
              species={formData.species.toLowerCase()}
              value={formData.breed2}
              onChange={handleBreed2Change}
              disabled={isLoading}
              excludeBreeds={[formData.breed1]}
              size="medium"
              hideLabel
              onEmptySpeciesClick={() => setShowSpeciesRequired(true)}
              showBreedPlaceholder={false}
              data-testid="breed2-search"
            />
            {formData.breed2 && (
              <IconButton
                onClick={handleClearBreed2}
                disabled={isLoading}
                size="small"
                data-testid="remove-breed2-button"
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
    </div>
  );
};

export { IdentificationFields };
