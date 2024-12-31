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
  excludeBreeds = [],
  required = false,
  disabled = false
}) => {
  const breedOptions = useMemo(() => {
    const breeds = species ? getBreedsBySpecies(species) : [];
    return breeds.filter(breed => !excludeBreeds.includes(breed));
  }, [species, excludeBreeds]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breedOptions}
        disabled={disabled || !species}
        renderInput={params => (
          <TextField
            {...params}
            required={required}
            label="Breed"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important"
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSearch;
