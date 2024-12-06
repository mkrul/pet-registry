import React, { useEffect, useRef } from "react";
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

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    mapInstanceRef.current = L.map(mapRef.current).setView([37.0902, -95.7129], 4);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    // Add click listener to the map
    mapInstanceRef.current.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current!);

      // Get address details from coordinates using Nominatim
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

      // Add dragend event listener to marker
      markerRef.current.on("dragend", async () => {
        const position = markerRef.current!.getLatLng();
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

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
    });

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
