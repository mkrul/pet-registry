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
import { useTheme } from "../../../shared/contexts/ThemeContext";

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
  showInitialMarker = true,
  dashboard = false
}) => {
  const { isDarkMode } = useTheme();
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
  const isDisabled = isLoading || isProcessingAddress || isProcessingMap;

  React.useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessingAddress || isProcessingMap);
    }
  }, [isProcessingAddress, isProcessingMap, onProcessingStateChange]);

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
    if (dashboard) {
      return "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    }
    if (labelStyle === "microchip") {
      return "text-lg font-medium text-gray-900 dark:text-gray-100";
    }
    return "text-lg font-medium text-gray-900 dark:text-gray-100 mb-2";
  };

  const getAutocompleteInputSx = () => {
    const baseStyles = {
      "& .MuiOutlinedInput-root": {
        borderRadius: "0.375rem",
        padding: 0,
        "& .MuiAutocomplete-input": {
          padding: "12px 14px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: "1.5rem"
        },
        "& fieldset": {
          borderColor: "rgb(209 213 219)"
        },
        "&:hover fieldset": {
          borderColor: "rgb(156 163 175)"
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgb(59 130 246)"
        }
      },
      "& .MuiAutocomplete-paper": {
        backgroundColor: "rgb(255 255 255)"
      }
    };

    if (!dashboard) {
      return {
        ...baseStyles,
        "& .MuiOutlinedInput-root": {
          ...baseStyles["& .MuiOutlinedInput-root"],
          backgroundColor: "white",
          "& .MuiAutocomplete-input": {
            ...baseStyles["& .MuiOutlinedInput-root"]["& .MuiAutocomplete-input"],
            color: "rgb(17, 24, 39)"
          }
        }
      };
    }

    // Dashboard styling (dark background with translucent dropdown)
    const typography = {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "1.5rem"
    };

    return {
      "& .MuiOutlinedInput-root": {
        backgroundColor: isDarkMode ? "rgba(29, 29, 29, 1)" : "white",
        borderRadius: "0.375rem",
        padding: 0,
        "& .MuiAutocomplete-input": {
          padding: "12px 14px",
          color: isDarkMode ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
          ...typography
        },
        "& .MuiAutocomplete-endAdornment": {
          color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
          right: "10px"
        },
        "& fieldset": {
          borderColor: isDarkMode ? "rgb(55 65 81)" : "rgb(209 213 219)"
        },
        "&:hover fieldset": {
          borderColor: isDarkMode ? "rgb(75 85 99)" : "rgb(156 163 175)"
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgb(59 130 246)"
        }
      },
      "& .MuiAutocomplete-popupIndicator": {
        color: isDarkMode ? "rgb(243, 244, 246)" : "rgb(75 85 99)"
      },
      "& .MuiAutocomplete-clearIndicator": {
        color: isDarkMode ? "rgb(243, 244, 246)" : "rgb(75 85 99)"
      },
      "& .MuiAutocomplete-paper": {
        backgroundColor: isDarkMode ? "rgba(29, 29, 29, 1)" : "white",
        color: isDarkMode ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
        borderRadius: "0.375rem",
        border: isDarkMode ? "1px solid rgba(29, 29, 29, 1)" : "1px solid rgb(209 213 219)",
        ...typography
      },
      "& .MuiAutocomplete-option": {
        ...typography,
        "&[aria-selected='true']": {
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          color: isDarkMode ? "rgb(147, 197, 253)" : "rgb(30, 64, 175)"
        },
        "&:hover": {
          backgroundColor: isDarkMode ? "rgba(75, 85, 99, 0.6)" : "rgb(243 244 246)"
        }
      },
      "& .MuiAutocomplete-listbox": {
        padding: 0
      }
    };
  };

  const labelText = dashboard ? "Location" : "Location:";

  return (
    <div className="space-y-2">
      <label htmlFor="report-location-search" className={getLabelClassName()}>
        {labelText}
      </label>
      {showTip && !selectedLocation && (
        <Tip>
          Click on the map or type the address where the animal was last seen.
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
              id="report-location-search"
              name="location-search"
              autoComplete="off"
              required={required}
              error={!!error}
              sx={getAutocompleteInputSx()}
            />
          )}
          disabled={isDisabled}
        />
      </div>
      <FormFieldError error={error} />
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

