import React from "react";

interface LocationDisplayProps {
  area: string;
  state: string;
  country: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ area, state, country }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Location</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-md text-gray-500 mb-1">Area</div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 truncate">
            {area || "No area selected"}
          </div>
        </div>
        <div>
          <div className="text-md text-gray-500 mb-1">State</div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 truncate">
            {state || "No state selected"}
          </div>
        </div>
        <div>
          <div className="text-md text-gray-500 mb-1">Country</div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 truncate">
            {country || "No country selected"}
          </div>
        </div>
      </div>
    </div>
  );
};
