import React from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletSetup";
import { MapEvents } from "./MapEvents";
import { MAP_ZOOM_LEVELS } from "../../constants/map";

export const Map = ({
  onLocationSelect,
  initialLocation,
  readOnly,
  initialZoom,
  onProcessingStateChange,
  showInitialMarker = true
}) => {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <LeafletMapContainer
        center={[39.8283, -98.5795]}
        zoom={initialZoom || MAP_ZOOM_LEVELS.DEFAULT}
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

export default Map;
