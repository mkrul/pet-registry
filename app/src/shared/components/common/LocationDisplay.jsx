import React from "react";
import { getStateAbbreviation } from "../../utils/stateUtils";
const LocationDisplay = ({
  area,
  state,
  textStyle = "text-gray-500",
  intersection,
  displayTip,
  useStateAbbreviation = false,
  showReportedMissing = false
}) => {
  const locationString = () => {
    if (area && state) {
      const stateDisplay = useStateAbbreviation ? getStateAbbreviation(state) : state;
      if (showReportedMissing) {
        if (intersection && intersection !== "") {
          return <p>{intersection} in {area}, {stateDisplay}</p>;
        }
        return <p>{area}, {stateDisplay}</p>;
      }
      return <p>{intersection && intersection !== "" ? `${intersection} in ` : ''}{area}, {stateDisplay}</p>;
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
