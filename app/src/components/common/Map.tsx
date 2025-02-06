import React from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapProps } from "../../types/common/Map";
import "../../utils/leafletSetup";
import { LatLngExpression } from "leaflet";
import { MapEvents } from "./MapEvents";
import { MapContainer } from "./MapContainer";
import { DEFAULT_MAP_CENTER } from "../../constants/map";

export const Map: React.FC<MapProps> = ({
  onLocationSelect,
  initialLocation,
  initialZoom = 4,
  readOnly = false
}) => {
  return (
    <MapContainer>
      {setNotification => (
        <LeafletMapContainer
          center={
            initialLocation?.latitude && initialLocation?.longitude
              ? ([initialLocation.latitude, initialLocation.longitude] as LatLngExpression)
              : ([DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude] as LatLngExpression)
          }
          zoom={initialZoom}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents
            onLocationSelect={onLocationSelect}
            initialLocation={initialLocation}
            onNotification={setNotification}
            readOnly={readOnly}
            initialZoom={initialZoom}
          />
        </LeafletMapContainer>
      )}
    </MapContainer>
  );
};

export default Map;
