import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";
import Filters from "../../components/shared/Filters";

const ReportIndexPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

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
    console.log("=== Component Mount/Update ===");
    console.log("Current searchParams:", Object.fromEntries(searchParams));
    console.log("Current filters:", filters);

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
    console.log("Current filters before search:", filters);
    console.log("Current pending filters:", pendingFilters);

    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set("query", searchQuery);
    }

    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    console.log("Final search params:", Object.fromEntries(newParams));
    setSearchParams(newParams);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: filterType, value } = e.target;
    console.log("=== Filter Change Start ===");
    console.log(`Changing filter ${filterType} to:`, value);
    console.log("Previous pendingFilters:", pendingFilters);

    // Handle location filter dependencies
    const updatedPendingFilters =
      filterType === "country"
        ? { ...pendingFilters, [filterType]: value, state: "", city: "" }
        : filterType === "state"
          ? { ...pendingFilters, [filterType]: value, city: "" }
          : { ...pendingFilters, [filterType]: value };

    console.log("Updated pendingFilters:", updatedPendingFilters);
    setPendingFilters(updatedPendingFilters);
    console.log("=== Filter Change End ===");
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
    console.log("Updating search params with filters:", currentFilters);
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

    console.log("Final search params:", params);
    setSearchParams(params);
  };

  return (
    <div className="mx-auto p-4 mt-5">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="w-full xl:w-2/5 flex content-end xl:ml-auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="w-full">
            <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border border-blue-500 rounded-md transition-colors w-32 ${
              showFilters
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>

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
