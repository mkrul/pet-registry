import React, { useState } from "react";
import SearchContainer from "../../components/search/SearchContainer";
import ReportsContainer from "../../components/reports/ReportsContainer";
import { IFilters } from "../../types/search/Search";

const ReportIndexPage = () => {
  const [activeSearch, setActiveSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<IFilters>({
    species: "",
    color: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    sort: "Newest",
    breed: ""
  });

  const handleSearchComplete = (query: string, _page: number, filters: IFilters) => {
    setActiveSearch(query);
    setActiveFilters(filters);
  };

  return (
    <div className="mx-auto p-4 mt-5">
      <div className="flex flex-col gap-4">
        <SearchContainer onSearchComplete={handleSearchComplete} />

        <div className="mt-4">
          <ReportsContainer query={activeSearch} filters={activeFilters} />
        </div>
      </div>
    </div>
  );
};

export default ReportIndexPage;
