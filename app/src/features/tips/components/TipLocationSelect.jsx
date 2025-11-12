import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";
import { TipMap } from "./TipMap";
import LocationDisplay from "../../../shared/components/common/LocationDisplay";
import { Autocomplete, TextField } from "@mui/material";
import { debounce } from "lodash";
import Spinner from "../../../shared/components/common/Spinner";
import { createMapLocation } from "../../../shared/utils/mapUtils";
import { processAddress } from "../../../shared/geocoding";
import { FormFieldError } from "../../../shared/components/common/FormFieldError";
import Tip from "../../../shared/components/common/Tip";
import { useTheme } from "../../../shared/hooks/useTheme";

const TIP_ZOOM_LEVELS = {
  FORM: 15,
  DEFAULT: 4
};

const MemoizedTipMap = React.memo(TipMap);

export const TipLocationSelect = ({
  onLocationSelect,
  initialLocation,
  isLoading,
  isLocationDataLoading = false,
  error,
  required = true,
  onProcessingStateChange,
  showTip = true,
  labelStyle = "default",
  initialZoom,
  showInitialMarker = false,
  placeholderText,
  mapCenterLocation
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

  React.useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessingAddress || isProcessingMap);
    }
  }, [isProcessingAddress, isProcessingMap, onProcessingStateChange]);

  React.useEffect(() => {
    if (required && !isLocationDataLoading && !currentMapLocation && !initialLocation) {
      setHasLocationError(true);
    } else {
      setHasLocationError(false);
    }
  }, [required, isLocationDataLoading, currentMapLocation, initialLocation]);

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
    } else {
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
        setTimeout(() => setSearchInput(""), 0);
      } catch (error) {
      } finally {
        setIsProcessingAddress(false);
      }
    }
  }, [onLocationSelect]);

  const mapLocation = useMemo(() => {
    if (currentMapLocation) {
      return createMapLocation(currentMapLocation);
    }
    if (initialLocation && !showInitialMarker) {
      return createMapLocation(initialLocation);
    }
    if (mapCenterLocation?.latitude && mapCenterLocation?.longitude) {
      return createMapLocation({
        latitude: parseFloat(mapCenterLocation.latitude),
        longitude: parseFloat(mapCenterLocation.longitude),
        area: mapCenterLocation.area,
        state: mapCenterLocation.state,
        country: mapCenterLocation.country,
        intersection: mapCenterLocation.intersection
      });
    }
    return undefined;
  }, [currentMapLocation, initialLocation, showInitialMarker, mapCenterLocation]);

  const { isDarkMode } = useTheme();

  const mapZoom = useMemo(() => {
    if (initialZoom) {
      return initialZoom;
    }
    return currentMapLocation ? TIP_ZOOM_LEVELS.FORM : TIP_ZOOM_LEVELS.DEFAULT;
  }, [currentMapLocation, initialZoom]);

  const getAutocompleteInputSx = () => ({
    backgroundColor: isDarkMode ? "rgb(55 65 81)" : "white",
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDarkMode ? "rgb(55 65 81)" : "white",
      color: isDarkMode ? "rgb(243 244 246)" : "rgb(17 24 39)",
      "& .MuiAutocomplete-input": {
        color: isDarkMode ? "rgb(243 244 246)" : "rgb(17 24 39)"
      },
      "& fieldset": {
        borderColor: isDarkMode ? "rgb(75 85 99)" : "rgb(209 213 219)"
      },
      "&:hover fieldset": {
        borderColor: isDarkMode ? "rgb(107 114 128)" : "rgb(156 163 175)"
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgb(59 130 246)"
      }
    },
    "& .MuiAutocomplete-paper": {
      backgroundColor: isDarkMode ? "rgb(31 41 55)" : "white",
      color: isDarkMode ? "rgb(243 244 246)" : "rgb(17 24 39)",
      "& .MuiAutocomplete-option": {
        "&[aria-selected='true']": {
          backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.12)",
          color: isDarkMode ? "rgb(147 197 253)" : "rgb(30 64 175)"
        },
        "&:hover": {
          backgroundColor: isDarkMode ? "rgb(55 65 81)" : "rgb(243 244 246)"
        }
      }
    }
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Location (optional):</label>
      {selectedLocation ? (
        <LocationDisplay
          area={selectedLocation.area}
          state={selectedLocation.state}
          country={selectedLocation.country}
          intersection={selectedLocation.intersection}
          displayTip={true}
        />
      ) : placeholderText ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">{placeholderText}</p>
      ) : null}
      <div className="flex gap-2 mb-4">
        <Autocomplete
          fullWidth
          options={suggestions}
          getOptionLabel={(option) => option.display_name}
          filterOptions={x => x}
          value={selectedAddress}
          onChange={handleAddressSelect}
          onInputChange={useCallback((_, value) => {
            if (!isProcessingAddress) {
              setSearchInput(value);
            }
          }, [isProcessingAddress])}
          renderInput={params => (
            <TextField
              {...params}
              aria-label="Enter a location"
              placeholder="Enter a location"
              name="location-search"
              autoComplete="off"
              required={false}
              error={!!error}
              sx={getAutocompleteInputSx()}
            />
          )}
          disabled={isDisabled}
        />
      </div>
      <FormFieldError error={error || (hasLocationError ? "Please select a location on the map or type the address " : null)} />
      <div className="relative mt-1">
        <MemoizedTipMap
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

export default TipLocationSelect;

