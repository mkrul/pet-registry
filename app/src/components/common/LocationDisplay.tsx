import React from "react";

interface LocationDisplayProps {
  area?: string | null;
  state?: string | null;
  country?: string | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ area, state, country }) => {
  const locationParts = [area, state, country].filter(Boolean);

  if (locationParts.length === 0) {
    return null;
  }

  return <p className="text-gray-500 mt-2 mb-4">{locationParts.join(", ")}</p>;
};

export default LocationDisplay;
