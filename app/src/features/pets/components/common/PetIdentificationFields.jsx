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
import { getGenderOptions } from "../../../../shared/reports/genderList";
import speciesListJson from "../../../../../../config/species.json";
import BreedSearch from "../../../../shared/components/common/BreedSearch.jsx";
import { commonInputStyles } from "../../../../shared/commonStyles";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";

export const PetIdentificationFields = ({
  formData,
  onInputChange,
  isLoading,
  error,
  breedError,
  alteredError,
  microchipError,
  dashboard = false
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

  const mapAlteredValue = (value) => {
    if (value === "true" || value === true) {
      return true;
    }
    if (value === "false" || value === false) {
      return false;
    }
    return null;
  };

  const handleAlteredChange = (value) => {
    onInputChange(createChangeEvent("isAltered", mapAlteredValue(value)));
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

  if (dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="microchip-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Microchip ID
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">(Leave blank if not known)</span>
          </label>
          <input
            id="microchip-id"
            data-testid="microchip-id-input"
            name="microchipId"
            type="text"
            value={formData.microchipId || ""}
            onChange={onInputChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter microchip ID"
          />
          <FormFieldError error={microchipError} />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">(Leave blank if not known)</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              id="gender"
              data-testid="gender-select"
              value={formData.gender || ""}
              onChange={(e) => handleFieldChange("gender")(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select gender</option>
              {genderOptions.map((gender, index) => (
                <option key={index} value={gender} data-testid="gender-option">
                  {gender}
                </option>
              ))}
            </select>
            {formData.gender && (
              <button
                type="button"
                onClick={handleClearGender}
                disabled={isLoading}
                data-testid="remove-gender-button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear gender"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Is the pet spayed or neutered?</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="isAltered"
                value="true"
                checked={formData.isAltered === true}
                onChange={(e) => handleAlteredChange(e.target.value)}
                disabled={isLoading}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isAltered"
                value="false"
                checked={formData.isAltered === false}
                onChange={(e) => handleAlteredChange(e.target.value)}
                disabled={isLoading}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isAltered"
                value=""
                checked={formData.isAltered === null || formData.isAltered === ""}
                onChange={(e) => handleAlteredChange(e.target.value)}
                disabled={isLoading}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">I don't know</span>
            </label>
          </div>
          <FormFieldError error={alteredError} />
        </div>

        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Species
          </label>
          <select
            id="species"
            name="species"
            value={formData.species?.toLowerCase() || ""}
            onChange={handleSpeciesChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select species</option>
            {speciesOptions.map(option => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
          <FormFieldError error={error} />
          {showSpeciesRequired && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/40 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
              Please select a species first
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Breed</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <BreedSearch
                species={formData.species?.toLowerCase()}
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
                dashboard
                data-testid="breed-search"
              />
            </div>
            {formData.breed1 && (
              <button
                type="button"
                onClick={handleClearBreed1}
                disabled={isLoading}
                data-testid="remove-breed1-button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear first breed"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
          <FormFieldError error={breedError} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Second Breed</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <BreedSearch
                species={formData.species?.toLowerCase()}
                value={formData.breed2}
                onChange={handleBreed2Change}
                disabled={isLoading}
                excludeBreeds={[formData.breed1]}
                size="medium"
                hideLabel
                onEmptySpeciesClick={() => setShowSpeciesRequired(true)}
                showBreedPlaceholder={false}
                dashboard
                data-testid="breed2-search"
              />
            </div>
            {formData.breed2 && (
              <button
                type="button"
                onClick={handleClearBreed2}
                disabled={isLoading}
                data-testid="remove-breed2-button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear second breed"
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Microchip ID:</label>
        <span className="text-sm text-gray-500 dark:text-gray-400"> (Leave blank if not known)</span>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Gender:</label>{" "}
        <span className="text-sm text-gray-500 dark:text-gray-400"> (Leave blank if not known)</span>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Is the pet spayed or neutered?
        </label>
        <div>
          <RadioGroup
            name="isAltered"
            value={formData.isAltered === null ? "" : String(formData.isAltered)}
            onChange={(e) => handleAlteredChange(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
            <FormControlLabel value="" control={<Radio />} label="I don't know" />
          </RadioGroup>
          <FormFieldError error={alteredError} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Species:</label>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">First Breed:</label>
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
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Second Breed:</label>
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
