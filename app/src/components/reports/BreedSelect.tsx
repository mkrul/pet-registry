import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { getBreedsBySpecies, Species } from "../../lib/reports/breedLists";

interface IBreedSelect {
  species: Species | "";
  value: string;
  onChange: (value: string) => void;
}

const BreedSelect: React.FC<IBreedSelect> = ({ species, value, onChange }) => {
  const breeds = getBreedsBySpecies(species || null);

  return (
    <div className="w-full">
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        options={breeds}
        disabled={!species}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Breed"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white !important"
              }
            }}
          />
        )}
      />
    </div>
  );
};

export default BreedSelect;
