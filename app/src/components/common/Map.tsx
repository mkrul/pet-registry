import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";
import Notification from "./Notification";
import { MapProps } from "../../types/common/Map";
import { isUSLocation } from "../../utils/locationUtils";
import { NotificationType } from "../../types/common/Notification";
import "../../utils/leafletSetup";

const findNearestArea = async (
  lat: number,
  lng: number,
  onNotification: (notification: { type: NotificationType; message: string }) => void
): Promise<string> => {
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

    if (data && data.address) {
      // Check various address fields in priority order
      const areaName =
        data.address.city ||
        data.address.area ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.address.neighbourhood ||
        data.address.municipality ||
        data.address.hamlet ||
        data.address.isolated_dwelling ||
        data.address.county;

      // If we found a valid area name, return it
      if (areaName && !areaName.toLowerCase().includes("unknown")) {
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

      if (widerData && widerData.address) {
        const widerAreaName =
          widerData.address.city ||
          widerData.address.area ||
          widerData.address.town ||
          widerData.address.village ||
          widerData.address.suburb ||
          widerData.address.neighbourhood ||
          widerData.address.municipality ||
          widerData.address.hamlet ||
          widerData.address.isolated_dwelling ||
          widerData.address.county;

        if (widerAreaName && !widerAreaName.toLowerCase().includes("unknown")) {
          return widerAreaName;
        }
      }
    }
    return "Unknown Location";
  } catch (error) {
    onNotification({
      type: NotificationType.ERROR,
      message:
        "The map does not recognize the location you selected. Please choose a different location."
    });
    return "Unknown Location";
  }
};

const findNearbyStreets = async (lat: number, lng: number): Promise<string | null> => {
  try {
    // First get the main street
    const mainResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `zoom=18&` +
        `addressdetails=1`
    );

    const mainData = await mainResponse.json();
    const mainRoad = mainData?.address?.road;

    if (!mainRoad) {
      return null;
    }

    // Use a smaller initial radius to find nearby intersecting roads
    const radius = 100; // Start with 100m radius
    const query = `
      [out:json][timeout:25];
      (
        way(around:${radius},${lat},${lng})[highway~"^(primary|secondary|tertiary|residential|unclassified)$"][name];
      );
      out body;
      >;
      out skel qt;
    `;

    const overpassResponse = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    const overpassData = await overpassResponse.json();

    // Sort roads by distance from the clicked point
    const roads = overpassData.elements
      .filter(
        (element: { tags?: { name?: string; highway?: string } }) =>
          element.tags?.name && element.tags.name.toLowerCase() !== mainRoad.toLowerCase()
      )
      .map((element: { tags?: { name?: string } }) => element.tags?.name)
      .filter((name?: string): name is string => !!name);

    // If no intersecting roads found with initial radius, try a slightly larger radius
    if (roads.length === 0) {
      const widerQuery = query.replace(`${radius}`, "200"); // Increase to 200m
      const widerResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(widerQuery)}`
      );
      const widerData = await widerResponse.json();

      roads.push(
        ...widerData.elements
          .filter(
            (element: { tags?: { name?: string; highway?: string } }) =>
              element.tags?.name && element.tags.name.toLowerCase() !== mainRoad.toLowerCase()
          )
          .map((element: { tags?: { name?: string } }) => element.tags?.name)
          .filter((name?: string): name is string => !!name)
      );
    }

    // Take the first (closest) intersecting road
    if (roads.length > 0) {
      return `${mainRoad} at ${roads[0]}`;
    }

    return null;
  } catch (error) {
    console.error("Error finding nearby streets:", error);
    return null;
  }
};

const MapEvents = ({
  onLocationSelect,
  initialLocation,
  onNotification
}: MapProps & {
  onNotification: (notification: { type: NotificationType; message: string } | null) => void;
}) => {
  const markerRef = useRef<L.Marker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const map = useMapEvents({
    click: async e => {
      if (isProcessing) return;
      setIsProcessing(true);
      const { lat, lng } = e.latlng;

      try {
        const formattedLat = Number(lat.toFixed(6));
        const formattedLng = Number(lng.toFixed(6));

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formattedLat}&lon=${formattedLng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.address;

        // Check if location is in the US
        if (!isUSLocation(address.country || "")) {
          onNotification({
            type: NotificationType.ERROR,
            message: "Sorry, we are only able to support US locations at this time."
          });
          setIsProcessing(false);
          return;
        }

        // Clear notification when selecting US location
        onNotification(null);

        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }

        let area =
          address.area ||
          address.town ||
          address.village ||
          address.suburb ||
          address.municipality ||
          address.neighbourhood;

        if (!area || area === "Unknown") {
          area = await findNearestArea(formattedLat, formattedLng, onNotification);
        }

        if (area === "Unknown Location") {
          onNotification({
            type: NotificationType.ERROR,
            message:
              "The map does not recognize the location you selected. Please choose a different location."
          });
          if (onLocationSelect) {
            onLocationSelect({
              latitude: 0,
              longitude: 0,
              area: "",
              state: "",
              country: "",
              intersection: null
            });
          }
          setIsProcessing(false);
          return;
        }

        // Create new marker only after confirming valid location
        markerRef.current = L.marker([formattedLat, formattedLng], { draggable: true }).addTo(map);

        // Debug logging for OpenStreetMap response
        console.log("OpenStreetMap raw address data:", address);
        console.log("Road value:", address.road);
        console.log("Available paths:", {
          footway: address.footway,
          path: address.path,
          cycleway: address.cycleway,
          pedestrian: address.pedestrian,
          service: address.service,
          residential: address.residential
        });

        // Try to find nearby intersecting streets
        const intersectionStr = await findNearbyStreets(formattedLat, formattedLng);

        const locationData = {
          latitude: formattedLat,
          longitude: formattedLng,
          area: area,
          state: address.state || "",
          country: address.country || "",
          intersection: intersectionStr
        };

        // Debug logging for intersection calculation
        console.log("Intersection calculation:", {
          hasRoad: !!address.road,
          intersectingPaths: [
            address.footway,
            address.path,
            address.cycleway,
            address.pedestrian,
            address.service,
            address.residential
          ].filter(Boolean),
          finalIntersection: locationData.intersection
        });

        console.log("Final Location Data:", locationData);
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
  initialZoom = 15,
  readOnly = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);
  const defaultCenter: [number, number] = [39.8283, -98.5795]; // Center of US

  const center: [number, number] =
    initialLocation?.latitude && initialLocation?.longitude
      ? [initialLocation.latitude, initialLocation.longitude]
      : defaultCenter;

  return (
    <div className="space-y-2">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={initialZoom}
          className="h-full w-full"
          whenReady={() => setIsLoading(false)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {!readOnly && (
            <MapEvents
              onLocationSelect={onLocationSelect}
              initialLocation={initialLocation}
              onNotification={setNotification}
            />
          )}
          {initialLocation?.latitude && initialLocation?.longitude && (
            <Marker position={[initialLocation.latitude, initialLocation.longitude]} />
          )}
        </MapContainer>
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
            <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
