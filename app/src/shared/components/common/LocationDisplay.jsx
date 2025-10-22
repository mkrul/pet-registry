import React from "react";
import { getStateAbbreviation } from "../../utils/stateUtils";
const LocationDisplay = ({
  area,
  state,
  intersection,
  displayTip,
  useStateAbbreviation = false
}) => {
  const locationParts = [area, state, "United States", intersection].filter(Boolean);

  if (locationParts.length === 0) {
    return null;
  }

  const locationString = () => {
    if (area && state) {
      const stateDisplay = useStateAbbreviation ? getStateAbbreviation(state) : state;
      return (
        <>
          {intersection && intersection !== "" && <p>Went missing near {intersection} in {area}, {stateDisplay}</p>}
          {intersection === "" && <p>Went missing in {area}, {stateDisplay}</p>}
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
