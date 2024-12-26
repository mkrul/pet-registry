import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/search/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";
import Filters from "../../components/search/Filters";

const ReportIndexPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const queryParam = searchParams.get("query") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const speciesParam = searchParams.get("species") || "";
  const colorParam = searchParams.get("color") || "";
  const genderParam = searchParams.get("gender") || "";
  const sortParam = searchParams.get("sort") || "Newest";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [pendingFilters, setPendingFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    city: "",
    state: "",
    country: "",
    sort: sortParam,
    breed: searchParams.get("breed") || ""
  });
  const [activeFilters, setActiveFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    city: "",
    state: "",
    country: "",
    sort: sortParam,
    breed: searchParams.get("breed") || ""
  });

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const speciesParam = searchParams.get("species") || "";
    const colorParam = searchParams.get("color") || "";
    const genderParam = searchParams.get("gender") || "";
    const sortParam = searchParams.get("sort") || "Newest";

    setSearchQuery(queryParam);
    setCurrentPage(pageParam);

    setPendingFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      sort: sortParam,
      breed: searchParams.get("breed") || ""
    });

    setActiveFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      sort: sortParam,
      breed: searchParams.get("breed") || ""
    });

    if (queryParam) {
      setActiveSearch(queryParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set("query", searchQuery);
    }

    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: filterType, value } = e.target;
    const updatedPendingFilters =
      filterType === "country"
        ? { ...pendingFilters, [filterType]: value, state: "", city: "" }
        : filterType === "state"
          ? { ...pendingFilters, [filterType]: value, city: "" }
          : { ...pendingFilters, [filterType]: value };

    setPendingFilters(updatedPendingFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      species: "",
      color: "",
      gender: "",
      city: "",
      state: "",
      country: "",
      sort: "Newest",
      breed: ""
    };
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
    setPendingFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    updateSearchParams("", 1, defaultFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(searchQuery, page, activeFilters);
  };

  const updateSearchParams = (
    query: string,
    page: number,
    currentFilters: typeof activeFilters
  ) => {
    const params: Record<string, string> = {};

    // Only add page parameter if it's not page 1
    if (page > 1) {
      params.page = page.toString();
    }

    if (query) params.query = query;
    if (currentFilters.species) params.species = currentFilters.species;
    if (currentFilters.color) params.color = currentFilters.color;
    if (currentFilters.gender) params.gender = currentFilters.gender;
    if (currentFilters.country) params.country = currentFilters.country;
    if (currentFilters.state) params.state = currentFilters.state;
    if (currentFilters.city) params.city = currentFilters.city;
    if (currentFilters.sort && currentFilters.sort !== "Newest") params.sort = currentFilters.sort;
    if (currentFilters.breed) params.breed = currentFilters.breed;

    setSearchParams(params);
  };

  return (
    <div className="mx-auto p-4 mt-5">
      <div className="flex flex-col gap-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onReset={handleReset}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Filters */}
        {showFilters && (
          <div className="w-full">
            <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Reports Container */}
        <div className="mt-4">
          <ReportsContainer
            query={activeSearch}
            page={currentPage}
            onPageChange={handlePageChange}
            filters={activeFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportIndexPage;
