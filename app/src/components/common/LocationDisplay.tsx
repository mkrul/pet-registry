import React from "react";
import { LocationDisplayProps } from "../../types/common/LocationDisplay";

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  area,
  state,
  country,
  intersection
}) => {
  const locationParts = [area, state, country].filter(Boolean);

  if (locationParts.length === 0) {
    return null;
  }

  return (
    <div className="text-gray-500 mt-2">
      {intersection && <p className="mb-1">Nearest intersection: {intersection}</p>}
      <p>{locationParts.join(", ")}</p>
    </div>
  );
};

export default LocationDisplay;
