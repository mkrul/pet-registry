import React, { useState, useEffect } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../shared/utils/leafletSetup";
import { processAddress } from "../../../shared/geocoding";
import Spinner from "../../../shared/components/common/Spinner";
import { DEFAULT_MAP_CENTER } from "../../../shared/constants/map";

const TIP_ZOOM_LEVELS = {
  FORM: 15,
  DEFAULT: 4
};

const MapView = ({ initialLocation, initialZoom, hasSetInitialView, setHasSetInitialView }) => {
  const map = useMap();

  useEffect(() => {
    console.log('[TipMap MapView] useEffect triggered:', {
      hasSetInitialView,
      initialLocation,
      hasInitialLocation: !!initialLocation,
      initialLocationLat: initialLocation?.latitude,
      initialLocationLng: initialLocation?.longitude,
      initialZoom
    });

    if (initialLocation?.latitude && initialLocation?.longitude) {
      console.log('[TipMap MapView] Setting map view to initialLocation:', {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
        zoom: initialZoom
      });
      map.setView([initialLocation.latitude, initialLocation.longitude], initialZoom, {
        animate: true
      });
      if (!hasSetInitialView) {
        setHasSetInitialView(true);
        console.log('[TipMap MapView] Set hasSetInitialView to true');
      }
    } else if (!hasSetInitialView) {
      console.log('[TipMap MapView] No initialLocation, setting map view to DEFAULT_MAP_CENTER:', DEFAULT_MAP_CENTER);
      map.setView([DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude], initialZoom, {
        animate: true
      });
      setHasSetInitialView(true);
      console.log('[TipMap MapView] Set hasSetInitialView to true');
    }
  }, [
    map,
    initialLocation?.latitude,
    initialLocation?.longitude,
    initialZoom,
    hasSetInitialView,
    setHasSetInitialView
  ]);

  return null;
};

const MapEvents = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom,
  onProcessingStateChange,
  showInitialMarker
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hasSetInitialView, setHasSetInitialView] = useState(false);

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
      const targetZoom = Math.max(currentZoom, TIP_ZOOM_LEVELS.FORM);
      map.setView([initialLocation.latitude, initialLocation.longitude], targetZoom);
    }
  }, [initialLocation?.latitude, initialLocation?.longitude, showInitialMarker, map]);

  const handleLocationSelect = async (lat, lng) => {
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
          const targetZoom = Math.max(currentZoom, TIP_ZOOM_LEVELS.FORM);
          map.setView([formattedLat, formattedLng], targetZoom);
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

export const TipMap = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom,
  onProcessingStateChange,
  showInitialMarker = false
}) => {
  console.log('[TipMap] Component render:', {
    initialLocation,
    hasInitialLocation: !!initialLocation,
    initialLocationLat: initialLocation?.latitude,
    initialLocationLng: initialLocation?.longitude,
    initialZoom,
    showInitialMarker
  });

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <LeafletMapContainer
        center={[DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude]}
        zoom={initialZoom || TIP_ZOOM_LEVELS.DEFAULT}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents
          onLocationSelect={onLocationSelect}
          initialLocation={initialLocation}
          readOnly={readOnly}
          initialZoom={initialZoom}
          onProcessingStateChange={onProcessingStateChange}
          showInitialMarker={showInitialMarker}
        />
      </LeafletMapContainer>
    </div>
  );
};

export default TipMap;

