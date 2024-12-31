import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl } from "@mui/material";
import { getBreedsBySpecies } from "../../lib/reports/breedList";

interface BreedSearchProps {
  species: "dog" | "cat";
  value: string;
  onChange: (breed: string) => void;
  excludeBreeds?: string[];
  required?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;
  size?: "small" | "medium";
  disableClearable?: boolean;
}

export const BreedSearch: React.FC<BreedSearchProps> = ({
  species,
  value,
  onChange,
  excludeBreeds = [],
  required = false,
  disabled = false,
  hideLabel = false,
  size = "small",
  disableClearable = false
}) => {
  const breedOptions = useMemo(() => {
    const breeds = species ? getBreedsBySpecies(species) : [];
    return breeds.filter(breed => !excludeBreeds.includes(breed));
  }, [species, excludeBreeds]);

  const inputHeight = size === "medium" ? "56px" : "40px";

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breedOptions}
        disabled={disabled || !species}
        size={size}
        disableClearable={disableClearable}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: inputHeight
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            required={required}
            label={hideLabel ? undefined : "Breed"}
            variant="outlined"
            size={size}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important",
                height: inputHeight
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSearch;
