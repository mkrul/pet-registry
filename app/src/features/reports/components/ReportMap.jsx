import React, { useState, useEffect } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../shared/utils/leafletSetup";
import { processAddress } from "../../../shared/geocoding";
import Spinner from "../../../shared/components/common/Spinner";
import { DEFAULT_MAP_CENTER, REPORT_ZOOM_LEVELS } from "../../../shared/constants/map";
import { useTheme } from "../../../shared/contexts/ThemeContext";

const LIGHT_TILE_LAYER = {
  id: "light-base",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const MapView = ({ initialLocation, initialZoom, hasSetInitialView, setHasSetInitialView }) => {
  const map = useMap();

  useEffect(() => {
    if (!hasSetInitialView) {
      if (initialLocation?.latitude && initialLocation?.longitude) {
        map.setView([initialLocation.latitude, initialLocation.longitude], initialZoom, {
          animate: true
        });
      } else {
        map.setView([DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude], initialZoom, {
          animate: true
        });
      }
      setHasSetInitialView(true);
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
  showInitialMarker,
  showPin = false
}) => {
  console.log('[DEBUG] ReportMap MapEvents received props:', { showPin, initialLocation, showInitialMarker });
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
      const targetZoom = Math.max(currentZoom, REPORT_ZOOM_LEVELS.EDIT);
      map.setView([initialLocation.latitude, initialLocation.longitude], targetZoom);
    }
  }, [initialLocation?.latitude, initialLocation?.longitude, showInitialMarker, map]);

  useEffect(() => {
    if (showPin && initialLocation?.latitude && initialLocation?.longitude) {
      console.log('[DEBUG] Setting pin from showPin and initialLocation:', initialLocation);
      setSelectedPosition([initialLocation.latitude, initialLocation.longitude]);
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, REPORT_ZOOM_LEVELS.EDIT);
      map.setView([initialLocation.latitude, initialLocation.longitude], targetZoom);
    }
  }, [showPin, initialLocation?.latitude, initialLocation?.longitude, map]);

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
          const targetZoom = Math.max(currentZoom, REPORT_ZOOM_LEVELS.EDIT);
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
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/75">
          <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
        </div>
      ) : null}
      {!readOnly && selectedPosition && <Marker position={selectedPosition} />}
    </>
  );
};

export const ReportMap = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom,
  onProcessingStateChange,
  showInitialMarker = true,
  showPin = false
}) => {
  const tileLayers = [LIGHT_TILE_LAYER];

  console.log('[DEBUG] ReportMap received props:', { showPin, initialLocation, showInitialMarker });
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <LeafletMapContainer
        center={[DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude]}
        zoom={initialZoom || REPORT_ZOOM_LEVELS.DEFAULT}
        className="h-full"
      >
        {tileLayers.map(({ id, attribution, url, zIndex }) => (
          <TileLayer key={id} attribution={attribution} url={url} zIndex={zIndex} />
        ))}
        <MapEvents
          onLocationSelect={onLocationSelect}
          initialLocation={initialLocation}
          readOnly={readOnly}
          initialZoom={initialZoom}
          onProcessingStateChange={onProcessingStateChange}
          showInitialMarker={showInitialMarker}
          showPin={showPin}
        />
      </LeafletMapContainer>
    </div>
  );
};

export default ReportMap;

