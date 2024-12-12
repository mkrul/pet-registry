import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }) => void;
}

const LocationMarker: React.FC<{ onLocationSelect: MapProps["onLocationSelect"] }> = ({
  onLocationSelect
}) => {
  const [position, setPosition] = React.useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchLocationDetails(e.latlng.lat, e.latlng.lng, onLocationSelect);
    },
    dragend() {
      if (position) {
        fetchLocationDetails(position.lat, position.lng, onLocationSelect);
      }
    }
  });

  return position === null ? null : <Marker position={position} draggable={true} />;
};

const fetchLocationDetails = async (
  lat: number,
  lng: number,
  onLocationSelect: MapProps["onLocationSelect"]
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    const address = data.address;
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      country: address.country || ""
    });
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
};

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default Map;
