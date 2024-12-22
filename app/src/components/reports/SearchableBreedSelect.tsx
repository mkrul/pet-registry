import React, { useState, useEffect } from "react";
import { TextField, Popper, Paper, MenuItem, FormControl } from "@mui/material";

interface SearchableBreedSelectProps {
  value: string;
  onChange: (breed: string) => void;
  disabled?: boolean;
  required?: boolean;
  label: string;
  availableBreeds: string[];
  placeholder?: string;
  sx?: any;
}

const SearchableBreedSelect: React.FC<SearchableBreedSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  label,
  availableBreeds,
  placeholder = "Search breeds...",
  sx = {}
}) => {
  const [input, setInput] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    setAnchorEl(e.currentTarget);

    if (!newValue) {
      setSuggestions([]);
      onChange("");
      return;
    }

    const filteredSuggestions = availableBreeds.filter(breed =>
      breed.toLowerCase().includes(newValue.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSelect = (breed: string) => {
    setInput(breed);
    setShowSuggestions(false);
    onChange(breed);
  };

  return (
    <FormControl fullWidth>
      <TextField
        label={label}
        value={input}
        onChange={handleInputChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        variant="outlined"
        sx={sx}
      />
      <Popper
        open={showSuggestions && suggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.clientWidth, zIndex: 1300 }}
      >
        <Paper elevation={3}>
          {suggestions.map((suggestion, index) => (
            <MenuItem key={`${suggestion}-${index}`} onClick={() => handleSelect(suggestion)}>
              {suggestion}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    </FormControl>
  );
};

export default SearchableBreedSelect;
