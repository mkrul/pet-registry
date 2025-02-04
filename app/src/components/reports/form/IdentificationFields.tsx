import React from "react";
import { FormControl, TextField, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { Species } from "../../../lib/reports/breedList";
import { getGenderOptions } from "../../../lib/reports/genderList";
import speciesListJson from "../../../../../config/species.json";
import BreedSearch from "../../common/BreedSearch";
import { IdentificationFieldsProps } from "../../../types/Report";
import CloseIcon from "@mui/icons-material/Close";
import { commonInputStyles } from "../../../styles/commonStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Tip from "../../common/Tip";

export const IdentificationFields: React.FC<IdentificationFieldsProps> = ({
  formData,
  showBreed2,
  onInputChange,
  onBreedChange,
  onBreed2Change,
  onSpeciesChange,
  onShowBreed2Change,
  isLoading
}) => {
  const genderOptions = getGenderOptions();
  const speciesOptions = speciesListJson.options;

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
            onChange={onInputChange}
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
        <label className="text-lg font-medium text-gray-900 mb-2">Species:</label>
        <FormControl fullWidth>
          <Select
            data-testid="species-select"
            labelId="species-label"
            id="species"
            value={formData.species}
            onChange={e => onSpeciesChange(e.target.value as Species)}
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
            {speciesOptions.map((species, index) => (
              <MenuItem key={`${species}-${index}`} value={species} data-testid="species-option">
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Breed(s):</label>
        <Tip>
          Breeds can be difficult to identify visually. If you are unsure of the animal's primary
          breed makeup, use your best guess or select "Mixed Breed" from the dropdown.
        </Tip>
        <BreedSearch
          species={formData.species.toLowerCase() as "dog" | "cat"}
          value={formData.breed1}
          onChange={breed => onBreedChange(breed)}
          disabled={isLoading}
          excludeBreeds={formData.breed2 ? [formData.breed2] : []}
          required
          size="medium"
          hideLabel
          disableClearable
        />
        {!showBreed2 && formData.breed1 && (
          <Button
            data-testid="add-breed-button"
            onClick={() => onShowBreed2Change(true)}
            disabled={isLoading}
            color="primary"
            variant="text"
            className="mt-2"
            sx={commonInputStyles}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2 mb-[3px]" />
              <span>ADD ANOTHER BREED</span>
            </div>
          </Button>
        )}
      </div>

      {showBreed2 && (
        <div className="space-y-2">
          <label className="text-lg font-medium text-gray-900 mb-2">Second Breed:</label>
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <BreedSearch
                species={formData.species.toLowerCase() as "dog" | "cat"}
                value={formData.breed2 || ""}
                onChange={breed => onBreed2Change(breed)}
                disabled={isLoading}
                excludeBreeds={[formData.breed1]}
                size="medium"
                hideLabel
                disableClearable
              />
            </div>
            <Button
              data-testid="remove-breed-button"
              onClick={() => onShowBreed2Change(false)}
              disabled={isLoading}
              color="error"
              variant="text"
              startIcon={<CloseIcon fontSize="medium" />}
              aria-label="Remove Breed"
              sx={commonInputStyles}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
