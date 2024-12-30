import React, { useState } from "react";
import Map from "../shared/Map";
import { LocationDisplay } from "./LocationDisplay";

interface ReportLocationSelectProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
  }) => void;
}

export const ReportLocationSelect: React.FC<ReportLocationSelectProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    area: string;
    state: string;
    country: string;
  } | null>(null);

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
  }) => {
    setSelectedLocation({
      area: location.area,
      state: location.state,
      country: location.country
    });
    onLocationSelect(location);
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Location</label>
      {selectedLocation && (
        <p className="text-gray-500 mt-2">
          {[selectedLocation.area, selectedLocation.state, selectedLocation.country]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
      <div className="mt-1">
        <Map onLocationSelect={handleLocationSelect} initialLocation={undefined} initialZoom={13} />
      </div>
    </div>
  );
};
