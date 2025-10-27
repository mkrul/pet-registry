import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";
import { ReportMap } from "./ReportMap";
import LocationDisplay from "../../../shared/components/common/LocationDisplay";
import { Autocomplete, TextField } from "@mui/material";
import { debounce } from "lodash";
import Spinner from "../../../shared/components/common/Spinner";
import { createMapLocation } from "../../../shared/utils/mapUtils";
import { processAddress } from "../../../shared/geocoding";
import { FormFieldError } from "../../../shared/components/common/FormFieldError";
import Tip from "../../../shared/components/common/Tip";
import { REPORT_ZOOM_LEVELS } from "../../../shared/constants/map";

const MemoizedReportMap = React.memo(ReportMap);

export const ReportLocationSelect = ({
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
      } else {
        setCurrentMapLocation(null);
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
          console.log('[DEBUG] Address selected, setting currentMapLocation:', locationData);
        }
        setSelectedAddress(null);
        setTimeout(() => setSearchInput(""), 0);
      } catch (error) {
        console.error("Error handling location:", error);
      } finally {
        setIsProcessingAddress(false);
      }
    }
  }, [onLocationSelect]);

  const mapLocation = useMemo(() => {
    if (currentMapLocation) {
      const location = createMapLocation(currentMapLocation);
      console.log('[DEBUG] mapLocation created from currentMapLocation:', location);
      return location;
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
    return (currentMapLocation || (initialLocation && !showInitialMarker)) ? REPORT_ZOOM_LEVELS.EDIT : REPORT_ZOOM_LEVELS.DEFAULT;
  }, [currentMapLocation, initialLocation, showInitialMarker, initialZoom]);

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
          Click on the map or type the address where the animal was last seen. To protect your privacy, the published report will only list the general area or nearest intersection.
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
            if (!isProcessingAddress) {
              setSearchInput(value);
            }
          }, [isProcessingAddress])}
          renderInput={params => (
            <TextField
              {...params}
              aria-label="Enter an address"
              name="location-search"
              autoComplete="off"
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
      <FormFieldError error={error || (hasLocationError ? "Please select a location on the map or type the address " : null)} />
      <div className="relative mt-1">
        {console.log('[DEBUG] Rendering ReportMap with:', { mapLocation, showPin: !!currentMapLocation, currentMapLocation })}
        <ReportMap
          onLocationSelect={handleLocationSelect}
          initialLocation={mapLocation}
          initialZoom={mapZoom}
          showPin={!!currentMapLocation}
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

export default ReportLocationSelect;

