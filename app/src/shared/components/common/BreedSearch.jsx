import React, { useMemo } from "react";
import { TextField, Autocomplete, FormControl } from "@mui/material";
import { getBreedsBySpecies } from "../../reports/breedList";
import { useTheme } from "../../contexts/ThemeContext";

export const BreedSearch = ({
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
  dashboard = false,
  "data-testid": dataTestId
}) => {
  const { isDarkMode } = useTheme();
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

  const inputSx = {
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
    },
    "& .MuiInputBase-input": {
      color: "#111827"
    },
    ...(dashboard ? {
      "& .MuiOutlinedInput-root": {
        backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1) !important' : 'white !important',
      },
      "& .MuiInputBase-root": {
        height: '48px',
        backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1) !important' : 'white !important',
        borderRadius: '0.375rem',
        color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
      },
      "& .MuiInputBase-root.Mui-focused": {
        backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1) !important' : 'white !important',
      },
      "& .MuiInputBase-root.Mui-hover": {
        backgroundColor: isDarkMode ? 'rgba(29, 29, 29, 1) !important' : 'white !important',
      },
      "& fieldset": {
        borderColor: error
          ? 'rgb(239, 68, 68) !important'
          : isDarkMode
            ? 'rgba(29, 29, 29, 1) !important'
            : 'rgb(209, 213, 219) !important'
      },
      "& .MuiOutlinedInput-root:hover fieldset": {
        borderColor: error
          ? 'rgb(220, 38, 38) !important'
          : isDarkMode
            ? 'rgba(29, 29, 29, 1) !important'
            : 'rgb(156, 163, 175) !important'
      },
      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderWidth: '2px !important',
        borderColor: 'rgb(59, 130, 246) !important'
      },
      "& .MuiOutlinedInput-input": {
        padding: '12px 14px !important',
        color: `${isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)'} !important`,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.25rem'
      },
      "& .MuiInputBase-input::placeholder": {
        color: `${isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'} !important`,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
      }
    } : {})
  };

  const dashboardSlotProps = dashboard
    ? {
        paper: {
          sx: {
            mt: 1,
            borderRadius: '0.375rem',
            border: isDarkMode
              ? '1px solid rgba(29, 29, 29, 1) !important'
              : '1px solid rgb(209, 213, 219) !important',
            backgroundColor: isDarkMode
              ? 'rgba(29, 29, 29, 1) !important'
              : 'white !important',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '& .MuiAutocomplete-option': {
              fontSize: '0.875rem',
              padding: '8px 12px',
              color: isDarkMode
                ? 'rgb(243, 244, 246) !important'
                : 'rgb(17, 24, 39) !important',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              backgroundColor: isDarkMode
                ? 'rgba(29, 29, 29, 1) !important'
                : 'white !important',
              '&[aria-selected="true"]': {
                backgroundColor: isDarkMode
                  ? 'rgba(59, 130, 246, 0.2) !important'
                  : 'rgba(59, 130, 246, 0.12) !important',
                color: isDarkMode
                  ? 'rgb(147, 197, 253) !important'
                  : '#1d4ed8 !important'
              },
              '&.Mui-focused': {
                backgroundColor: isDarkMode
                  ? 'rgba(59, 130, 246, 0.15) !important'
                  : 'rgba(59, 130, 246, 0.08) !important'
              },
              '&:hover': {
                backgroundColor: isDarkMode
                  ? 'rgb(75, 85, 99) !important'
                  : 'rgb(243, 244, 246) !important'
              }
            }
          }
        }
      }
    : {};

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
          },
          ...dashboardSlotProps
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
            sx={inputSx}
            inputProps={{
              ...params.inputProps,
              "aria-label": hideLabel ? "Breed" : undefined
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default BreedSearch;
