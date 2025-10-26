import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import Map from "../../../../shared/components/common/Map.jsx";

// Memoized Map component to prevent unnecessary re-renders
const MemoizedMap = React.memo(Map);

import LocationDisplay from "../../../../shared/components/common/LocationDisplay.jsx";
import { Autocomplete, TextField } from "@mui/material";
import { debounce } from "lodash";
import Spinner from "../../../../shared/components/common/Spinner.jsx";
import { MAP_ZOOM_LEVELS } from "../../../../shared/constants/map.js";
import { createMapLocation } from "../../../../shared/utils/mapUtils.js";
import { processAddress } from "../../../../shared/geocoding.js";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";
import Tip from "../../../../shared/components/common/Tip.jsx";

export const LocationSelect = ({
  onLocationSelect,
  initialLocation,
  isLoading,
  error,
  required = true,
  onProcessingStateChange,
  showTip = true,
  labelStyle = "default",
  initialZoom,
  showInitialMarker = true
}) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation
      ? {
          area: initialLocation.area || "",
          state: initialLocation.state || "",
          country: initialLocation.country || "",
          intersection: initialLocation.intersection || ""
        }
      : null
  );
  const [currentMapLocation, setCurrentMapLocation] = useState(initialLocation);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessingAddress, setIsProcessingAddress] = useState(false);
  const [isProcessingMap, setIsProcessingMap] = useState(false);
  const [hasLocationError, setHasLocationError] = useState(false);
  const isDisabled = isLoading || isProcessingAddress || isProcessingMap;

  // Notify parent component when processing state changes
  React.useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessingAddress || isProcessingMap);
    }
  }, [isProcessingAddress, isProcessingMap, onProcessingStateChange]);

  React.useEffect(() => {
    if (required && !currentMapLocation && !initialLocation) {
      setHasLocationError(true);
    } else {
      setHasLocationError(false);
    }
  }, [required, currentMapLocation, initialLocation]);

  const fetchAddressSuggestions = React.useMemo(
    () =>
      debounce(async (input) => {
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

  const handleLocationSelect = useCallback((location) => {
    if (location.country !== "United States") {
      onLocationSelect({
        ...location,
        error: "Sorry, we are only able to support US locations at this time."
      });
      return;
    }
    setSelectedLocation({
      area: location.area,
      state: location.state,
      country: location.country,
      intersection: location.intersection
    });
    setCurrentMapLocation(location);
    setHasLocationError(false);
    onLocationSelect(location);
  }, [onLocationSelect]);

  const handleMapProcessingStateChange = useCallback((isProcessing) => {
    setIsProcessingMap(isProcessing);
  }, []);

  useLayoutEffect(() => {
    if (initialLocation) {
      const locationData = {
        area: initialLocation.area || "",
        state: initialLocation.state || "",
        country: initialLocation.country || "",
        intersection: initialLocation.intersection || ""
      };
      setSelectedLocation(locationData);
      if (showInitialMarker) {
        setCurrentMapLocation(initialLocation);
      }
    }
  }, [initialLocation, showInitialMarker]);

  const handleAddressSelect = useCallback(async (_, value) => {
    if (value) {
      const lat = parseFloat(value.lat);
      const lng = parseFloat(value.lon);

      try {
        setIsProcessingAddress(true);
        const locationData = await processAddress(lat, lng);
        if (locationData) {
          if (locationData.country !== "United States") {
            onLocationSelect({
              ...locationData,
              error: "Sorry, we are only able to support US locations at this time."
            });
            return;
          }
          setSelectedLocation({
            area: locationData.area,
            state: locationData.state,
            country: locationData.country,
            intersection: locationData.intersection
          });
          setHasLocationError(false);
          onLocationSelect(locationData);
          setCurrentMapLocation(locationData);
        }
        setSelectedAddress(null);
        // Clear searchInput after processing is complete to avoid setState during render
        setTimeout(() => setSearchInput(""), 0);
      } catch (error) {
        console.error("Error handling location:", error);
      } finally {
        setIsProcessingAddress(false);
      }
    }
  }, [onLocationSelect]);

  // Memoize expensive computations
  const mapLocation = useMemo(() => {
    if (currentMapLocation) {
      return createMapLocation(currentMapLocation);
    }
    if (initialLocation && !showInitialMarker) {
      return createMapLocation(initialLocation);
    }
    return undefined;
  }, [currentMapLocation, initialLocation, showInitialMarker]);

  const mapZoom = useMemo(() => {
    if (initialZoom) {
      return initialZoom;
    }
    return currentMapLocation ? MAP_ZOOM_LEVELS.EDIT : MAP_ZOOM_LEVELS.DEFAULT;
  }, [currentMapLocation, initialZoom]);

  const getLabelClassName = () => {
    if (labelStyle === "microchip") {
      return "text-lg font-medium text-gray-900";
    }
    return "text-lg font-medium text-gray-900 mb-2";
  };

  return (
    <div className="space-y-2">
      <label className={getLabelClassName()}>Location:</label>
      {showTip && (
        <Tip>
          Click on the map or enter the address where the animal was last seen. This address will remain private and the report will only show the general area or nearest intersection.
        </Tip>
      )}
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
          getOptionLabel={(option) => option.display_name}
          filterOptions={x => x}
          value={selectedAddress}
          onChange={handleAddressSelect}
          onInputChange={useCallback((_, value) => {
            // Don't update searchInput during processing to avoid setState during render
            if (!isProcessingAddress) {
              setSearchInput(value);
            }
          }, [isProcessingAddress])}
          renderInput={params => (
            <TextField
              {...params}
              aria-label="Enter an address"
              placeholder="Enter an address"
              required={false}
              error={!!error}
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
      <FormFieldError error={error || (hasLocationError ? "Please select a location on the map or enter an address" : null)} />
      <div className="relative mt-1">
        <MemoizedMap
          onLocationSelect={handleLocationSelect}
          initialLocation={mapLocation}
          initialZoom={mapZoom}
          readOnly={isDisabled}
          onProcessingStateChange={handleMapProcessingStateChange}
          showInitialMarker={showInitialMarker}
        />
        {(isProcessingAddress || isProcessingMap) && (
          <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
            <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};
