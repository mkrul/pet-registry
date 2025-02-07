import React, { useState, useEffect } from "react";
import { useMapEvents, Marker } from "react-leaflet";
import { MapProps } from "../../types/common/Map";
import { LocationData } from "../../types/Report";
import { processAddress } from "../../services/geocoding";
import Spinner from "./Spinner";
import { MapView } from "./MapView";
import { MAP_ZOOM_LEVELS } from "../../constants/map";

interface MapEventsProps extends MapProps {
  readOnly?: boolean;
}

export const MapEvents: React.FC<MapEventsProps> = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [hasSetInitialView, setHasSetInitialView] = useState(false);

  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      setSelectedPosition([initialLocation.latitude, initialLocation.longitude]);
    }
  }, [initialLocation?.latitude, initialLocation?.longitude]);

  const map = useMapEvents({
    click: async e => {
      if (!readOnly) {
        await handleLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  const handleLocationSelect = async (lat: number, lng: number, skipLocationFetch = false) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));
      const locationData = await processAddress(formattedLat, formattedLng);

      if (locationData) {
        if (!locationData.error) {
          setSelectedPosition([formattedLat, formattedLng]);
          map.setView([formattedLat, formattedLng], MAP_ZOOM_LEVELS.PIN_DROP);
        }
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error("Error handling location:", error);
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
