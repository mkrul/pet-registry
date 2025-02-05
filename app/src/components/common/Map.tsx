import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";
import Notification from "./Notification";
import { MapProps } from "../../types/common/Map";
import { isUSLocation } from "../../utils/locationUtils";
import { NotificationType } from "../../types/common/Notification";
import "../../utils/leafletSetup";
import { MapLocation } from "../../types/common/Map";
import { LocationData } from "../../types/Report";
import { LatLngExpression } from "leaflet";

const findNearestArea = async (
  lat: number,
  lng: number,
  onNotification: (notification: { type: NotificationType; message: string }) => void
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `zoom=10&` +
        `addressdetails=1`
    );

    const data = await response.json();

    if (data && data.address) {
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

      if (areaName && !areaName.toLowerCase().includes("unknown")) {
        return areaName;
      }

      const widerResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          `format=json&` +
          `lat=${lat}&` +
          `lon=${lng}&` +
          `zoom=8&` +
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

    const radius = 100;
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

    const roads = overpassData.elements
      .filter(
        (element: { tags?: { name?: string; highway?: string } }) =>
          element.tags?.name && element.tags.name.toLowerCase() !== mainRoad.toLowerCase()
      )
      .map((element: { tags?: { name?: string } }) => element.tags?.name)
      .filter((name?: string): name is string => !!name);

    if (roads.length === 0) {
      const widerQuery = query.replace(`${radius}`, "200");
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

    if (roads.length > 0) {
      return `${mainRoad} at ${roads[0]}`;
    }

    return null;
  } catch (error) {
    console.error("Error finding nearby streets:", error);
    return null;
  }
};

interface MapEventsProps extends MapProps {
  onNotification: (notification: { type: NotificationType; message: string } | null) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({
  onLocationSelect,
  initialLocation,
  onNotification,
  readOnly,
  initialZoom
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
    initialLocation?.latitude && initialLocation?.longitude
      ? [initialLocation.latitude, initialLocation.longitude]
      : null
  );
  const [hasSetInitialView, setHasSetInitialView] = useState(false);

  const map = useMapEvents({
    click: async e => {
      if (!readOnly) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
        await handleLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  const handleLocationSelect = async (lat: number, lng: number, skipLocationFetch = false) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));

      if (skipLocationFetch && initialLocation) {
        const locationData: LocationData = {
          latitude: formattedLat,
          longitude: formattedLng,
          area: initialLocation.area ?? "",
          state: initialLocation.state ?? "",
          country: initialLocation.country ?? "",
          intersection: initialLocation.intersection ?? ""
        };
        onLocationSelect(locationData);
        return;
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formattedLat}&lon=${formattedLng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.address;

      if (!isUSLocation(address.country || "")) {
        onNotification({
          type: NotificationType.ERROR,
          message: "Sorry, we are only able to support US locations at this time."
        });
        return;
      }

      onNotification(null);

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
      const intersectionStr = await findNearbyStreets(formattedLat, formattedLng);

      const locationData: LocationData = {
        latitude: formattedLat,
        longitude: formattedLng,
        area: area ?? "",
        state: address.state ?? "",
        country: address.country ?? "",
        intersection: intersectionStr ?? ""
      };

      if (onLocationSelect) {
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error("Error handling location:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      setSelectedPosition([initialLocation.latitude, initialLocation.longitude]);
      map.setView([initialLocation.latitude, initialLocation.longitude], 16, {
        animate: true
      });
      if (!hasSetInitialView) {
        setHasSetInitialView(true);
      }
    } else if (!hasSetInitialView) {
      map.setView([39.8283, -98.5795], initialZoom, { animate: true });
      setHasSetInitialView(true);
    }
  }, [map, initialLocation?.latitude, initialLocation?.longitude, initialZoom, hasSetInitialView]);

  return (
    <>
      {isProcessing ? (
        <div className="absolute inset-0 bg-white/75 z-[1000] flex items-center justify-center">
          <Spinner size={32} bgFaded={false} inline={true} className="text-gray-300" />
        </div>
      ) : null}
      {!readOnly && selectedPosition && <Marker position={selectedPosition} />}
    </>
  );
};

export const Map: React.FC<MapProps> = ({
  onLocationSelect,
  initialLocation,
  initialZoom = 4,
  readOnly = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const location: LocationData = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      area: "",
      state: "",
      country: "",
      intersection: ""
    };
    onLocationSelect(location);
  };

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
          center={
            initialLocation?.latitude && initialLocation?.longitude
              ? ([initialLocation.latitude, initialLocation.longitude] as LatLngExpression)
              : ([39.8283, -98.5795] as LatLngExpression)
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
