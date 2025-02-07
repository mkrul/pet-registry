import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl } from "@mui/material";
import { getBreedsBySpecies } from "../../lib/reports/breedList";
import { BreedSearchProps } from "../../types/common/BreedSearch";

export const BreedSearch: React.FC<BreedSearchProps> = ({
  species,
  value,
  onChange,
  excludeBreeds = [],
  disabled = false,
  size = "small",
  required = false,
  hideLabel = false,
  disableClearable = false,
  error = false,
  "data-testid": dataTestId
}) => {
  const breedOptions = useMemo(() => {
    const breeds = species ? getBreedsBySpecies(species) : [];
    return breeds.filter(breed => !excludeBreeds.includes(breed));
  }, [species, excludeBreeds]);

  const inputHeight = size === "medium" ? "56px" : "40px";

  return (
    <FormControl fullWidth data-testid={dataTestId}>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breedOptions}
        disabled={disabled || !species}
        size={size}
        disableClearable={disableClearable}
        slotProps={{
          listbox: {
            style: { maxHeight: 200 }
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={hideLabel ? undefined : "Breed"}
            variant="outlined"
            size={size}
            required={required}
            error={error}
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
