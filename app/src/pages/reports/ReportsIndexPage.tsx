import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";
import Filters from "../../components/shared/Filters";

const ReportIndexPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("query") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const speciesParam = searchParams.get("species") || "";
  const colorParam = searchParams.get("color") || "";
  const genderParam = searchParams.get("gender") || "";
  const sortParam = searchParams.get("sort") || "Newest";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [filters, setFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    sort: sortParam
  });

  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(pageParam);
    setFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      sort: sortParam
    });
  }, [queryParam, pageParam, speciesParam, colorParam, genderParam, sortParam]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateSearchParams(query, 1, filters);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    updateSearchParams(searchQuery, 1, newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(searchQuery, page, filters);
  };

  const updateSearchParams = (query: string, page: number, currentFilters: typeof filters) => {
    const params: Record<string, string> = { page: page.toString() };
    if (query) params.query = query;
    if (currentFilters.species) params.species = currentFilters.species;
    if (currentFilters.color) params.color = currentFilters.color;
    if (currentFilters.gender) params.gender = currentFilters.gender;
    if (currentFilters.sort) params.sort = currentFilters.sort;
    setSearchParams(params);
  };

  return (
    <div className="md:w-95% mx-auto p-4 mt-5">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center md:text-left">Lost Pets</h1>
        <div className="w-full md:w-2/3 flex flex-col items-end">
          <div className="w-full flex flex-wrap gap-2 justify-center md:justify-end">
            <div className="w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="xl:w-auto flex justify-center xl:justify-end">
              <Filters filters={filters} handleFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[2rem]">
        <ReportsContainer
          query={searchQuery}
          page={currentPage}
          onPageChange={handlePageChange}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default ReportIndexPage;
