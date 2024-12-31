import React from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button
} from "@mui/material";
import { Species } from "../../../lib/reports/breedList";
import { getGenderOptions } from "../../../lib/reports/genderList";
import speciesListJson from "../../../../../config/species.json";
import BreedSearch from "../../common/BreedSearch";
import { IdentificationFieldsProps } from "../../../types/Report";
import CloseIcon from "@mui/icons-material/Close";

const commonInputStyles = {
  backgroundColor: "white",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white"
  },
  "& .MuiSelect-select": {
    backgroundColor: "white"
  }
};

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
    <>
      <TextField
        label="Microchip ID (leave blank if not known)"
        name="microchipId"
        value={formData.microchipId || ""}
        onChange={onInputChange}
        variant="outlined"
        fullWidth
        sx={commonInputStyles}
      />

      <FormControl fullWidth>
        <InputLabel id="gender-label">Gender (leave blank if not known)</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          name="gender"
          value={formData.gender || ""}
          onChange={onInputChange}
          label="Gender"
          sx={commonInputStyles}
        >
          {genderOptions.map((gender, index) => (
            <MenuItem key={index} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="species-label">Species</InputLabel>
        <Select
          labelId="species-label"
          id="species"
          name="species"
          value={formData.species}
          onChange={e => onSpeciesChange(e.target.value as Species)}
          label="Species"
          sx={commonInputStyles}
        >
          {speciesOptions.map((species, index) => (
            <MenuItem key={`${species}-${index}`} value={species}>
              {species}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <BreedSearch
        species={formData.species.toLowerCase() as "dog" | "cat"}
        value={formData.breed1}
        onChange={breed => onBreedChange(breed)}
        disabled={isLoading}
        excludeBreeds={formData.breed2 ? [formData.breed2] : []}
        required
        size="small"
      />

      {!showBreed2 && formData.breed1 && (
        <Button
          onClick={() => onShowBreed2Change(true)}
          disabled={isLoading}
          color="primary"
          variant="text"
          className="mt-2"
        >
          + ADD ANOTHER BREED
        </Button>
      )}

      {showBreed2 && (
        <div className="flex items-center gap-2">
          <BreedSearch
            species={formData.species.toLowerCase() as "dog" | "cat"}
            value={formData.breed2 || ""}
            onChange={breed => onBreed2Change(breed)}
            disabled={isLoading}
            excludeBreeds={[formData.breed1]}
            size="small"
          />
          <button
            type="button"
            onClick={() => onShowBreed2Change(false)}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Breed"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}
    </>
  );
};
