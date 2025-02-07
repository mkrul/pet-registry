import React, { useState, useEffect } from "react";
import { useMapEvents, Marker } from "react-leaflet";
import { MapProps } from "../../types/common/Map";
import { LocationData } from "../../types/Report";
import { getLocationDetails } from "../../services/geocoding";
import Spinner from "./Spinner";
import { MapView } from "./MapView";
import { NotificationMessage } from "../../types/common/Notification";
import { isUSLocation } from "../../utils/locationUtils";

interface MapEventsProps extends MapProps {
  onNotification: (notification: NotificationMessage | null) => void;
}

export const MapEvents: React.FC<MapEventsProps> = ({
  onLocationSelect,
  initialLocation,
  onNotification,
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

      if (skipLocationFetch && initialLocation) {
        const locationData: LocationData = {
          latitude: formattedLat,
          longitude: formattedLng,
          area: initialLocation.area ?? "",
          state: initialLocation.state ?? "",
          country: initialLocation.country ?? "",
          intersection: initialLocation.intersection ?? ""
        };
        setSelectedPosition([formattedLat, formattedLng]);
        onLocationSelect(locationData);
        return;
      }

      const locationDetails = await getLocationDetails(formattedLat, formattedLng, onNotification);

      if (!locationDetails) return;

      const locationData: LocationData = {
        latitude: formattedLat,
        longitude: formattedLng,
        area: locationDetails.area ?? "",
        state: locationDetails.address.state ?? "",
        country: locationDetails.address.country ?? "",
        intersection: locationDetails.intersectionStr ?? ""
      };

      setSelectedPosition([formattedLat, formattedLng]);
      onNotification(null);
      onLocationSelect(locationData);
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
