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
import { IReportForm } from "../../types/Report";
import { Species } from "../../lib/reports/breedLists";
import { getGenderOptions } from "../../lib/reports/genderLists";
import speciesListJson from "../../../../config/species.json";
import BreedSelect from "./BreedSelect";

interface IdentificationFieldsProps {
  formData: IReportForm;
  showBreed2: boolean;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: boolean | null } }
  ) => void;
  onBreedChange: (breed: string) => void;
  onBreed2Change: (breed: string) => void;
  onSpeciesChange: (species: Species) => void;
  onShowBreed2Change: (show: boolean) => void;
  isLoading?: boolean;
}

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

      <BreedSelect
        species={formData.species as Species | ""}
        value={formData.breed1}
        onChange={onBreedChange}
        variant="form"
        label="Breed 1"
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
          <BreedSelect
            species={formData.species as Species | ""}
            value={formData.breed2 || ""}
            onChange={onBreed2Change}
            variant="form"
            label="Breed 2"
            excludeBreeds={[formData.breed1]}
          />
          <button
            type="button"
            onClick={() => onShowBreed2Change(false)}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Breed 2"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
