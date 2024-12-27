import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl, InputLabel, SxProps } from "@mui/material";
import { getBreedsBySpecies, Species } from "../../lib/reports/breedLists";

interface IBreedSelect {
  species: Species | "";
  value: string;
  onChange: (value: string) => void;
  variant?: "form" | "filter";
  required?: boolean;
  label?: string;
  sx?: SxProps;
  excludeBreeds?: string[];
}

export const BreedSelect: React.FC<IBreedSelect> = ({
  species,
  value,
  onChange,
  variant = "filter",
  required = false,
  label = "Breed",
  sx,
  excludeBreeds = []
}) => {
  const breedOptions = useMemo(() => {
    const breeds = species ? getBreedsBySpecies(species) : [];
    return breeds.filter(breed => !excludeBreeds.includes(breed));
  }, [species, excludeBreeds]);

  return (
    <FormControl fullWidth size={variant === "filter" ? "small" : "medium"}>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breedOptions}
        disabled={!species}
        renderInput={params => (
          <TextField
            {...params}
            label={variant === "form" ? label : undefined}
            placeholder={variant === "filter" ? label : undefined}
            size={variant === "filter" ? "small" : "medium"}
            variant="outlined"
            sx={{
              ...sx,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important",
                ...((sx as any)?.["& .MuiOutlinedInput-root"] || {})
              },
              "& .MuiInputBase-input.Mui-disabled": {
                opacity: 1,
                WebkitTextFillColor: "rgb(0, 0, 0)"
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSelect;
