import React, { useState, useEffect } from "react";
import Map from "../../common/Map";
import { ReportLocationFilterProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";
import { Autocomplete, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { findNearestArea, findNearbyStreets } from "../../../utils/locationUtils";
import { isUSLocation } from "../../../utils/locationUtils";
import Spinner from "../../common/Spinner";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const ReportLocationSelect: React.FC<ReportLocationFilterProps> = ({
  onLocationSelect,
  initialLocation
}) => {
  // Initialize selectedLocation based on initialLocation if it exists
  const [selectedLocation, setSelectedLocation] = useState<{
    area: string;
    state: string;
    country: string;
    intersection: string | null;
  } | null>(
    initialLocation
      ? {
          area: initialLocation.area || "",
          state: initialLocation.state || "",
          country: initialLocation.country || "",
          intersection: initialLocation.intersection || null
        }
      : null
  );
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(
    initialLocation && initialLocation.latitude !== null && initialLocation.longitude !== null
      ? {
          lat: initialLocation.latitude,
          lng: initialLocation.longitude
        }
      : null
  );
  const [isProcessingAddress, setIsProcessingAddress] = useState(false);

  const EDIT_MODE_ZOOM_LEVEL = 16;
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
    // Update selectedLocation whenever location changes, whether from map or search
    setSelectedLocation({
      area: location.area,
      state: location.state,
      country: location.country,
      intersection: location.intersection
    });
    onLocationSelect(location);
  };

  // Update useEffect to handle location updates from parent
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation({
        area: initialLocation.area || "",
        state: initialLocation.state || "",
        country: initialLocation.country || "",
        intersection: initialLocation.intersection || null
      });
    }
  }, [initialLocation]);

  const handleAddressSelect = async (_: any, value: AddressSuggestion | null) => {
    if (value) {
      setIsProcessingAddress(true);
      const lat = parseFloat(value.lat);
      const lng = parseFloat(value.lon);

      try {
        // Use the same location fetch logic as map clicks
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.address;

        // Check if location is in the US
        if (!isUSLocation(address.country || "")) {
          return;
        }

        let area =
          address.area ||
          address.town ||
          address.village ||
          address.suburb ||
          address.municipality ||
          address.neighbourhood;

        if (!area || area === "Unknown") {
          area = await findNearestArea(lat, lng, () => {});
        }

        // Try to find nearby intersecting streets
        const intersectionStr = await findNearbyStreets(lat, lng);

        const locationData = {
          latitude: lat,
          longitude: lng,
          area: area,
          state: address.state || "",
          country: address.country || "",
          intersection: intersectionStr
        };

        // Update both the map's selected location and form data
        setSelectedLocation({
          area: locationData.area,
          state: locationData.state,
          country: locationData.country,
          intersection: locationData.intersection
        });

        onLocationSelect(locationData);

        // Update map center
        setMapCenter({ lat, lng });

        // Clear the search state
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
      <label className="text-lg font-medium text-gray-900 mb-2">Location</label>
      {selectedLocation && (
        <LocationDisplay
          area={selectedLocation.area}
          state={selectedLocation.state}
          country={selectedLocation.country}
          intersection={selectedLocation.intersection}
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
              placeholder="Enter the last address that the animal was seen at"
              aria-label="Enter the last address that the animal was seen at"
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white"
                }
              }}
            />
          )}
        />
      </div>
      <div className="relative mt-1">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLocation={initialLocation}
          initialZoom={mapCenter ? EDIT_MODE_ZOOM_LEVEL : NEW_REPORT_ZOOM_LEVEL}
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
