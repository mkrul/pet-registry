import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl } from "@mui/material";
import { getBreedsBySpecies } from "../../reports/breedList";
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
  onEmptySpeciesClick,
  showBreedPlaceholder = true,
  "data-testid": dataTestId
}) => {
  const breedOptions = useMemo(() => {
    const breeds = species ? getBreedsBySpecies(species) : [];
    return breeds.filter(breed => !excludeBreeds.includes(breed));
  }, [species, excludeBreeds]);

  const handleClick = () => {
    if (!species && onEmptySpeciesClick) {
      onEmptySpeciesClick();
    }
  };

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
        onFocus={handleClick}
        slotProps={{
          listbox: {
            style: { maxHeight: 200 }
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={hideLabel ? undefined : "Breed"}
            placeholder={species ? (showBreedPlaceholder ? "Breed" : "") : "Please select a species first"}
            variant="outlined"
            size={size}
            required={required}
            error={error}
            InputProps={{
              ...params.InputProps,
              onClick: handleClick
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: inputHeight,
                backgroundColor: "white !important"
              },
              "& .MuiInputLabel-asterisk": {
                display: "none"
              },
              "& .MuiInputLabel-root": {
                color: "text.secondary"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "text.secondary"
              },
              "& .MuiInputLabel-root.MuiFormLabel-filled": {
                color: "text.secondary"
              },
              "& .MuiInputBase-input::placeholder": {
                opacity: species ? 1 : 0.8,
                color: species ? "text.primary" : "text.secondary",
                fontStyle: species ? "normal" : "italic"
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSearch;
