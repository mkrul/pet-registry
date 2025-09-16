import React from "react";
import { LocationDisplayProps } from "../../types/common/LocationDisplay";
import { getStateAbbreviation } from "../../utils/stateUtils";
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
      const stateAbbr = getStateAbbreviation(state);
      return (
        <>
          {intersection && <p>Last seen near {intersection} in {area}, {stateAbbr}</p>}
          <p>{}</p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="text-gray-500 mt-2">
      {locationString()}
    </div>
  );
};

export default LocationDisplay;
