import React, { useEffect, useRef, useState } from "react";

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    // Initialize the map
    if (mapRef.current && !map) {
      const initialMap = new google.maps.Map(mapRef.current, {
        center: { lat: 37.0902, lng: -95.7129 }, // Center of USA
        zoom: 4
      });

      setMap(initialMap);
      geocoder.current = new google.maps.Geocoder();

      // Add click listener to the map
      initialMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        const position = event.latLng;
        if (!position) return;

        // Remove existing marker if any
        if (marker) {
          marker.setMap(null);
        }

        // Create new marker
        const newMarker = new google.maps.Marker({
          position,
          map: initialMap,
          draggable: true
        });

        setMarker(newMarker);

        // Get address details from coordinates
        geocoder.current?.geocode(
          { location: { lat: position.lat(), lng: position.lng() } },
          (results, status) => {
            if (status === "OK" && results?.[0]) {
              const addressComponents = results[0].address_components;
              let city = "",
                state = "",
                country = "";

              for (const component of addressComponents) {
                if (component.types.includes("locality")) {
                  city = component.long_name;
                } else if (component.types.includes("administrative_area_level_1")) {
                  state = component.long_name;
                } else if (component.types.includes("country")) {
                  country = component.long_name;
                }
              }

              onLocationSelect({
                latitude: position.lat(),
                longitude: position.lng(),
                city,
                state,
                country
              });
            }
          }
        );
      });
    }
  }, [mapRef, map, marker, onLocationSelect]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
