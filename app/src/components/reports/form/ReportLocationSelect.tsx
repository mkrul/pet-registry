import React, { useState } from "react";
import Map from "../../common/Map";
import { ReportLocationFilterProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";
import { Autocomplete, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const ReportLocationSelect: React.FC<ReportLocationFilterProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    area: string;
    state: string;
    country: string;
    intersection: string | null;
  } | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const NEW_REPORT_ZOOM_LEVEL = 4;

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

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
    intersection: string | null;
  }) => {
    setSelectedLocation({
      area: location.area,
      state: location.state,
      country: location.country,
      intersection: location.intersection
    });
    onLocationSelect(location);
  };

  const handleSearch = () => {
    if (selectedAddress) {
      setMapCenter({
        lat: parseFloat(selectedAddress.lat),
        lng: parseFloat(selectedAddress.lon)
      });
      setSelectedLocation(null); // Clear any existing selected location
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Location</label>
      <div className="flex gap-2 mb-4">
        <Autocomplete
          fullWidth
          options={suggestions}
          getOptionLabel={(option: AddressSuggestion) => option.display_name}
          filterOptions={x => x} // Disable client-side filtering
          value={selectedAddress}
          onChange={(_, value) => setSelectedAddress(value)}
          onInputChange={(_, value) => setSearchInput(value)}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Enter last known address"
              aria-label="Enter the last known address where the pet was seen"
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white"
                }
              }}
            />
          )}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!selectedAddress}
          startIcon={<SearchIcon />}
          aria-label="Search for this address on the map"
          sx={{ minWidth: "120px" }}
        >
          Search
        </Button>
      </div>
      {selectedLocation && (
        <LocationDisplay
          area={selectedLocation.area}
          state={selectedLocation.state}
          country={selectedLocation.country}
          intersection={selectedLocation.intersection}
        />
      )}
      <div className="mt-1">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLocation={
            mapCenter
              ? {
                  latitude: mapCenter.lat,
                  longitude: mapCenter.lng
                }
              : undefined
          }
          initialZoom={mapCenter ? 16 : NEW_REPORT_ZOOM_LEVEL}
        />
      </div>
    </div>
  );
};
