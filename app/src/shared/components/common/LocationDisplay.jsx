import React from "react";
import { getStateAbbreviation } from "../../utils/stateUtils";
const LocationDisplay = ({
  area,
  state,
  textStyle = "text-gray-500",
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
      if (intersection && intersection !== "") {
        return <p>Reported missing near {intersection} in {area}, {stateDisplay}</p>;
      }
      return <p>Reported missing in {area}, {stateDisplay}</p>;
    }
    return null;
  };

  return (
    <div className={`${textStyle}`}>
      {locationString()}
    </div>
  );
};

export default LocationDisplay;
