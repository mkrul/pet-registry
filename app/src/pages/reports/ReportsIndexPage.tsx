import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";
import Filters from "../../components/shared/Filters";

const ReportsIndexPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSearch, setActiveSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    species: [] as string[],
    gender: [] as string[],
    color: [] as string[],
    status: [] as string[],
    sort: "newest"
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setActiveSearch(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <SearchBar onSearch={handleSearch} />
        <Filters onChange={handleFilterChange} />
        <ReportsContainer
          query={activeSearch}
          page={currentPage}
          species={activeFilters.species}
          gender={activeFilters.gender}
          color={activeFilters.color}
          status={activeFilters.status}
          sort={activeFilters.sort}
        />
      </div>
    </div>
  );
};

export default ReportsIndexPage;
