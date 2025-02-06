import React, { useState, useEffect } from "react";
import Map from "../../common/Map";
import { LocationData, LocationSelectProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";
import { Autocomplete, TextField } from "@mui/material";
import { debounce } from "lodash";
import Spinner from "../../common/Spinner";
import { MAP_ZOOM_LEVELS } from "../../../constants/map";
import { createMapLocation } from "../../../utils/mapUtils";
import { processAddress } from "../../../services/geocoding";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  onLocationSelect,
  initialLocation,
  isLoading
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Omit<
    LocationData,
    "latitude" | "longitude"
  > | null>(
    initialLocation
      ? {
          area: initialLocation.area || "",
          state: initialLocation.state || "",
          country: initialLocation.country || "",
          intersection: initialLocation.intersection || ""
        }
      : null
  );
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [isProcessingAddress, setIsProcessingAddress] = useState(false);
  const isDisabled = isLoading || isProcessingAddress;

  const fetchAddressSuggestions = React.useMemo(
    () =>
      debounce(async (input: string) => {
        if (input.length < 3) return;

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
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      }, 300),
    []
  );

  React.useEffect(() => {
    if (searchInput) {
      fetchAddressSuggestions(searchInput);
    } else {
      setSuggestions([]);
    }
  }, [searchInput, fetchAddressSuggestions]);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation({
      area: location.area,
      state: location.state,
      country: location.country,
      intersection: location.intersection
    });
    onLocationSelect(location);
  };

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation({
        area: initialLocation.area || "",
        state: initialLocation.state || "",
        country: initialLocation.country || "",
        intersection: initialLocation.intersection || ""
      });
    }
  }, [initialLocation]);

  const handleAddressSelect = async (_: React.SyntheticEvent, value: AddressSuggestion | null) => {
    if (value) {
      const lat = parseFloat(value.lat);
      const lng = parseFloat(value.lon);

      try {
        setIsProcessingAddress(true);
        const locationData = await processAddress(lat, lng);
        if (locationData) {
          setSelectedLocation(locationData);
          onLocationSelect(locationData);
        }
        setSelectedAddress(null);
        setSearchInput("");
      } catch (error) {
        console.error("Error handling location:", error);
      } finally {
        setIsProcessingAddress(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Location:</label>
      {selectedLocation && (
        <LocationDisplay
          area={selectedLocation.area}
          state={selectedLocation.state}
          country={selectedLocation.country}
          intersection={selectedLocation.intersection}
          displayTip={true}
        />
      )}
      <div className="flex gap-2 mb-4">
        <Autocomplete
          fullWidth
          options={suggestions}
          getOptionLabel={(option: AddressSuggestion) => option.display_name}
          filterOptions={x => x}
          value={selectedAddress}
          onChange={handleAddressSelect}
          onInputChange={(_, value) => setSearchInput(value)}
          renderInput={params => (
            <TextField
              {...params}
              aria-label="Enter the address that the animal was last seen at"
              placeholder="Enter the address that the animal was last seen at"
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  "& fieldset": {
                    borderColor: "rgb(209 213 219)"
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(156 163 175)"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgb(59 130 246)"
                  }
                }
              }}
            />
          )}
          disabled={isDisabled}
        />
      </div>
      <div className="relative mt-1">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLocation={initialLocation ? createMapLocation(initialLocation) : undefined}
          initialZoom={MAP_ZOOM_LEVELS.DEFAULT}
        />
        {isProcessingAddress && (
          <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
            <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};
