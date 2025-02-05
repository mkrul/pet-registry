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
    if (area && state) {
      return (
        <>
          <p>{`${area}, ${state}, United States`}</p>
          {intersection && <p>Intersection of {intersection}</p>}
        </>
      );
    }
    return null;
  };

  return (
    <div className="text-gray-500 mt-2">
      {displayTip && (
        <div className="mb-2">
          <Tip>If an exact address is not known, click on the map to set a location.</Tip>
        </div>
      )}
      {locationString()}
    </div>
  );
};

export default LocationDisplay;
