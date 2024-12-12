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

  const findNearestCity = async (lat: number, lon: number): Promise<string> => {
    try {
      console.log("Finding nearest city for coordinates:", { lat, lon });
      // Search for nearby places, using a simpler query
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          `format=json&` +
          `addressdetails=1&` +
          `accept-language=en&` +
          `zoom=10&` +
          `lat=${lat}&` +
          `lon=${lon}`
      );

      if (!response.ok) {
        console.error("Failed to fetch nearest city:", response.status, response.statusText);
        return "";
      }

      const data = await response.json();
      console.log("Nearest city search result:", data);

      if (data && data.address) {
        const cityName =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          data.address.county || // fallback to county if no city is found
          "";

        if (cityName) {
          console.log("Found nearest city:", cityName);
          return cityName;
        }
      }
      return "";
    } catch (error) {
      console.error("Error finding nearest city:", error);
      return "";
    }
  };

  const map = useMapEvents({
    click: async e => {
      const { lat, lng } = e.latlng;
      console.log("Map clicked at:", { lat, lng });

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
        let city = address.city || address.town || address.village || "";

        // If no city was found, search for the nearest city
        if (!city) {
          console.log("No city found in reverse geocoding, searching for nearest city");
          city = await findNearestCity(lat, lng);
        }

        const locationData = {
          latitude: lat,
          longitude: lng,
          city: city,
          state: address.state || "",
          country: address.country || ""
        };
        console.log("Sending location data to form:", locationData);
        onLocationSelect(locationData);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    }
  });

  return null;
};

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  return (
    <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ width: "100%", height: "400px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default Map;
