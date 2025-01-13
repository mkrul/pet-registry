import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl } from "@mui/material";
import { getBreedsBySpecies } from "../../lib/reports/breedList";
import { BreedSearchProps } from "../../types/common/BreedSearch";

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
    <FormControl fullWidth data-testid="breed-search-form-control">
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breedOptions}
        disabled={disabled || !species}
        size={size}
        disableClearable={disableClearable}
        renderInput={params => (
          <TextField
            {...params}
            label={hideLabel ? undefined : "Breed"}
            variant="outlined"
            size={size}
            InputProps={{
              ...params.InputProps,
              required: false
            }}
            inputProps={{
              ...params.inputProps,
              required: required
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: inputHeight,
                backgroundColor: "white !important"
              },
              "& .MuiInputLabel-asterisk": {
                display: "none"
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSearch;
