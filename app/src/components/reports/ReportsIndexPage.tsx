import React from "react";
import { useNavigate } from "react-router-dom";
import pathsService from "../../services/paths.service";

const ReportsIndexPage: React.FC = () => {
  const navigate = useNavigate();
  // ... other code ...

  const handleSearch = () => {
    console.log("Current filters before search:", filters);
    console.log("Current pending filters:", pendingFilters);

    // Create search params object with non-empty values
    const searchParams = Object.entries(pendingFilters).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    console.log("Final search params:", searchParams);

    // Update URL and trigger search
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`${pathsService.reports()}?${queryString}`);
  };

  // ... rest of the component
};

export default ReportsIndexPage;
