import React from "react";
import { useGetStatesQuery, useGetCitiesQuery } from "../../redux/features/reports/reportsApi";

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectClassName: string;
  disabledSelectClassName: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  country,
  state,
  city,
  onFilterChange,
  selectClassName,
  disabledSelectClassName
}) => {
  const { data: states = [], isLoading: isLoadingStates } = useGetStatesQuery(country, {
    skip: !country
  });

  const { data: cities = [], isLoading: isLoadingCities } = useGetCitiesQuery(
    { country, state },
    { skip: !country || !state }
  );

  return (
    <>
      <div className="w-full">
        <select
          name="city"
          value={city}
          onChange={onFilterChange}
          className={
            country && state && !isLoadingCities ? selectClassName : disabledSelectClassName
          }
          disabled={!country || !state || isLoadingCities}
        >
          <option value="">City</option>
          {cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <select
          name="state"
          value={state}
          onChange={onFilterChange}
          className={country && !isLoadingStates ? selectClassName : disabledSelectClassName}
          disabled={!country || isLoadingStates}
        >
          <option value="">State</option>
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <select
          name="country"
          value={country}
          onChange={onFilterChange}
          className={selectClassName}
        >
          <option value="">Country</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
        </select>
      </div>
    </>
  );
};

export default LocationSelect;
