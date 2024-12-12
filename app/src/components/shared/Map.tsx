import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }) => void;
}

const MapEvents = ({ onLocationSelect }: MapProps) => {
  const markerRef = useRef<L.Marker | null>(null);

  const map = useMapEvents({
    click: async e => {
      const { lat, lng } = e.latlng;

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);

      // Get address details from coordinates using Nominatim
      try {
        console.log("Fetching location details for", { lat, lng });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        console.log("Received location data:", data);

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

      // Add dragend event listener to marker
      markerRef.current.on("dragend", async () => {
        const position = markerRef.current!.getLatLng();
        try {
          console.log("Fetching location details after drag for", position);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          console.log("Received location data after drag:", data);

          const address = data.address;
          onLocationSelect({
            latitude: position.lat,
            longitude: position.lng,
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            country: address.country || ""
          });
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      });
    }
  });

  return null;
};

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  return (
    <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default Map;
