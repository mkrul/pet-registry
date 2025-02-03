import React from "react";
import { LocationDisplayProps } from "../../types/common/LocationDisplay";
import Tip from "./Tip";
const LocationDisplay: React.FC<LocationDisplayProps> = ({
  area,
  state,
  intersection,
  displayTip
}) => {
  const locationParts = [area, state, "United States", intersection].filter(Boolean);

  if (locationParts.length === 0) {
    return null;
  }

  const locationString = () => {
    if (locationParts.length === 4) {
      return (
        <>
          <p>{`${area}, ${state}, United States`}</p>
          <p>{intersection}</p>
        </>
      );
    }
    return locationParts.join(", ");
  };

  return (
    <div className="text-gray-500 mt-2">
      {displayTip && <Tip>Enter the last address that the animal was seen at.</Tip>}
      {locationString()}
    </div>
  );
};

export default LocationDisplay;
