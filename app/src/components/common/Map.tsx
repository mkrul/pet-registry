import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";
import { MapProps } from "../../types/common/Map";

const findNearestArea = async (lat: number, lng: number): Promise<string> => {
  console.log("Finding nearest area for coordinates:", { lat, lng });
  try {
    // Use reverse geocoding with a larger zoom level to find nearby places
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `zoom=10&` + // Use a wider zoom level to find nearby places
        `addressdetails=1`
    );

    const data = await response.json();
    console.log("Reverse geocoding results:", data);

    if (data && data.address) {
      // Check various address fields in priority order
      const areaName =
        data.address.area ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.address.municipality ||
        data.address.neighbourhood ||
        data.address.county;

      if (areaName && areaName.toLowerCase().includes("unknown")) {
        console.log("Found valid area name:", areaName);
        return areaName;
      }

      // If no area found in immediate area, try searching in a wider radius
      const widerResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          `format=json&` +
          `lat=${lat}&` +
          `lon=${lng}&` +
          `zoom=8&` + // Even wider zoom level
          `addressdetails=1`
      );

      const widerData = await widerResponse.json();
      console.log("Wider area search results:", widerData);

      if (widerData && widerData.address) {
        const widerAreaName =
          widerData.address.area ||
          widerData.address.town ||
          widerData.address.village ||
          widerData.address.suburb ||
          widerData.address.municipality ||
          widerData.address.county;

        if (widerAreaName && widerAreaName !== "Unknown") {
          return widerAreaName;
        }
      }
    }

    console.log("No valid area found in any search");
    return "Unknown Area";
  } catch (error) {
    console.error("Error finding nearest area:", error);
    return "Unknown Area";
  }
};

const MapEvents = ({ onLocationSelect, initialLocation }: MapProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const map = useMapEvents({
    click: async e => {
      if (isProcessing) return;
      setIsProcessing(true);
      const { lat, lng } = e.latlng;
      console.log("Map clicked at:", { lat, lng });

      try {
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Format coordinates to 6 decimal places
        const formattedLat = Number(lat.toFixed(6));
        const formattedLng = Number(lng.toFixed(6));

        // Create new marker
        markerRef.current = L.marker([formattedLat, formattedLng], { draggable: true }).addTo(map);

        console.log("Fetching location details for", { lat: formattedLat, lng: formattedLng });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formattedLat}&lon=${formattedLng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        console.log("Received location data:", data);

        const address = data.address;
        let area =
          address.area ||
          address.town ||
          address.village ||
          address.suburb ||
          address.municipality ||
          address.neighbourhood;

        if (!area || area === "Unknown") {
          console.log(
            "No valid area found in reverse geocoding, searching for nearest populated place"
          );
          area = await findNearestArea(formattedLat, formattedLng);
        }

        const locationData = {
          latitude: formattedLat,
          longitude: formattedLng,
          area: area,
          state: address.state || "",
          country: address.country || ""
        };
        console.log("Sending location data to form:", locationData);
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  });

  return isProcessing ? (
    <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
      <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
    </div>
  ) : null;
};

const Map: React.FC<MapProps> = ({
  onLocationSelect,
  initialLocation,
  initialZoom = 4,
  readOnly = false
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={initialZoom}
        className="h-full w-full"
        whenReady={() => setIsLoading(false)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {!readOnly && (
          <MapEvents onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
        )}
      </MapContainer>
      {isLoading && (
        <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
          <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default Map;
