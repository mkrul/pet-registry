import React, { useState } from "react";
import Map from "../../common/Map";
import { ReportLocationFilterProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";

export const ReportLocationSelect: React.FC<ReportLocationFilterProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    area: string;
    state: string;
    country: string;
  } | null>(null);

  const NEW_REPORT_ZOOM_LEVEL = 4;

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
        <LocationDisplay
          area={selectedLocation.area}
          state={selectedLocation.state}
          country={selectedLocation.country}
        />
      )}
      <div className="mt-1">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLocation={undefined}
          initialZoom={NEW_REPORT_ZOOM_LEVEL}
        />
      </div>
    </div>
  );
};
