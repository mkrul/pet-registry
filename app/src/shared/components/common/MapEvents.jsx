import React, { useState, useEffect } from "react";
import { useMapEvents, Marker } from "react-leaflet";
import { processAddress } from "../../geocoding";
import Spinner from "./Spinner";
import { MapView } from "./MapView";
import { MAP_ZOOM_LEVELS } from "../../constants/map";

export const MapEvents = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom,
  onProcessingStateChange,
  showInitialMarker = true,
  showPin = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hasSetInitialView, setHasSetInitialView] = useState(false);

  // Notify parent component when processing state changes
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessing);
    }
  }, [isProcessing, onProcessingStateChange]);

  const map = useMapEvents({
    click: async e => {
      if (!readOnly) {
        await handleLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  useEffect(() => {
    if (showInitialMarker && initialLocation?.latitude && initialLocation?.longitude) {
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, MAP_ZOOM_LEVELS.EDIT);
      map.setView([initialLocation.latitude, initialLocation.longitude], targetZoom);
    }
  }, [initialLocation?.latitude, initialLocation?.longitude, showInitialMarker, map]);

  useEffect(() => {
    if (showPin && initialLocation?.latitude && initialLocation?.longitude) {
      setSelectedPosition([initialLocation.latitude, initialLocation.longitude]);
    } else if (!showPin) {
      setSelectedPosition(null);
    }
  }, [showPin, initialLocation?.latitude, initialLocation?.longitude]);

  const handleLocationSelect = async (lat, lng, skipLocationFetch = false) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));
      const locationData = await processAddress(formattedLat, formattedLng);

      if (locationData) {
        if (!locationData.error) {
          setSelectedPosition([formattedLat, formattedLng]);
          const currentZoom = map.getZoom();
          const targetZoom = Math.max(currentZoom, MAP_ZOOM_LEVELS.EDIT);
          map.setView([formattedLat, formattedLng], targetZoom);
        }
        onLocationSelect(locationData);
      }
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <MapView
        initialLocation={initialLocation}
        initialZoom={initialZoom}
        hasSetInitialView={hasSetInitialView}
        setHasSetInitialView={setHasSetInitialView}
      />
      {isProcessing ? (
        <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
          <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
        </div>
      ) : null}
      {!readOnly && selectedPosition && <Marker position={selectedPosition} />}
    </>
  );
};
