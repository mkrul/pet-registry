import React from "react";
import { LocationDisplayProps } from "../../types/common/LocationDisplay";

const LocationDisplay: React.FC<LocationDisplayProps> = ({ area, state, country }) => {
  const locationParts = [area, state, country].filter(Boolean);

  if (locationParts.length === 0) {
    return null;
  }

  return <p className="text-gray-500 mt-2">{locationParts.join(", ")}</p>;
};

export default LocationDisplay;
