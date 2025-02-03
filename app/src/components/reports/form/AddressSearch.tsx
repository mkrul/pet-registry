import React, { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import { commonInputStyles } from "../../../styles/commonStyles";

interface AddressSearchProps {
  onSearch: (address: string) => Promise<void>;
  disabled?: boolean;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSearch, disabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddressSuggestions = React.useMemo(
    () =>
      debounce(async (input: string) => {
        if (input.length < 3) return;

        setLoading(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
              `format=json&` +
              `q=${encodeURIComponent(input)}` +
              `&countrycodes=us` +
              `&limit=5` +
              `&addressdetails=1`
          );
          const data = await response.json();
          setOptions(data);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  React.useEffect(() => {
    if (inputValue) {
      fetchAddressSuggestions(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, fetchAddressSuggestions]);

  const handleOptionSelect = async (_: any, value: AddressSuggestion | null) => {
    if (value) {
      await onSearch(value.display_name);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Address:</label>
      <Autocomplete
        fullWidth
        disabled={disabled}
        options={options}
        getOptionLabel={(option: AddressSuggestion) => option.display_name}
        filterOptions={x => x}
        loading={loading}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={handleOptionSelect}
        noOptionsText="Start typing to search for addresses"
        loadingText="Loading suggestions..."
        ListboxProps={{
          style: { maxHeight: 200 }
        }}
        renderInput={params => (
          <TextField
            {...params}
            aria-label="Enter the last known address that the animal was seen at"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
            sx={{
              ...commonInputStyles,
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white"
              }
            }}
          />
        )}
      />
    </div>
  );
};

export default AddressSearch;
