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
}

export const BreedSearch: React.FC<BreedSearchProps> = ({
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

export default BreedSearch;
