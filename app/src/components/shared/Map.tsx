import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }) => void;
  initialLocation?: {
    latitude: number | null;
    longitude: number | null;
  };
  initialZoom?: number;
  readOnly?: boolean;
}

const findNearestCity = async (lat: number, lng: number): Promise<string> => {
  console.log("Finding nearest city for coordinates:", { lat, lng });
  try {
    // Search for nearby places with a larger radius
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `featuretype=city&` +
        `limit=1`
    );

    const data = await response.json();
    console.log("Nearest city search results:", data);

    if (data && data.length > 0) {
      // Extract city name from the display name
      const displayName = data[0].display_name;
      const parts = displayName.split(", ");
      return parts[0] || "Unknown City";
    }

    return "Unknown City";
  } catch (error) {
    console.error("Error finding nearest city:", error);
    return "Unknown City";
  }
};

const MapEvents = ({ onLocationSelect, initialLocation }: MapProps) => {
  const markerRef = useRef<L.Marker | null>(null);
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

  // Set initial marker and zoom if coordinates exist
  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      console.log("Setting initial marker at:", initialLocation);

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add marker at initial location
      markerRef.current = L.marker([initialLocation.latitude, initialLocation.longitude], {
        draggable: true
      }).addTo(map);

      // Center and zoom map to marker
      map.setView([initialLocation.latitude, initialLocation.longitude], 13);
    }
  }, [initialLocation, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ onLocationSelect, initialLocation }) => {
  // Set initial center based on location or default to US center
  const center =
    initialLocation?.latitude && initialLocation?.longitude
      ? [initialLocation.latitude, initialLocation.longitude]
      : [37.0902, -95.7129];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={initialLocation?.latitude ? 13 : 4}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
    </MapContainer>
  );
};

export default Map;
