import React, { useState, useEffect } from "react";

interface BreedSuggestion {
  value: string;
  label: string;
}

interface SearchableBreedSelectProps {
  value: string;
  onChange: (breed: string) => void;
  disabled?: boolean;
  required?: boolean;
  label: string;
  availableBreeds: string[];
  placeholder?: string;
}

const SearchableBreedSelect: React.FC<SearchableBreedSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  label,
  availableBreeds,
  placeholder = "Search breeds..."
}) => {
  const [input, setInput] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<BreedSuggestion[]>([]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    if (!newValue) {
      setSuggestions([]);
      onChange("");
      return;
    }

    const filteredSuggestions = availableBreeds
      .filter(breed => breed.toLowerCase().includes(newValue.toLowerCase()))
      .map(breed => ({
        value: breed,
        label: breed
      }));

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSelect = (breed: string) => {
    setInput(breed);
    setShowSuggestions(false);
    onChange(breed);
  };

  return (
    <div className="relative">
      <label className="block font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onClick={e => {
          e.stopPropagation();
          setShowSuggestions(true);
        }}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.value}-${index}`}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2"
              onClick={() => handleSelect(suggestion.value)}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableBreedSelect;
