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
  const [activeFilters, setActiveFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    city: "",
    state: "",
    country: "",
    sort: sortParam
  });
  const [pendingFilters, setPendingFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    city: "",
    state: "",
    country: "",
    sort: sortParam
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
      sort: sortParam
    });

    setActiveFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      sort: sortParam
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
      sort: "Newest"
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

    console.log("Final search params:", params);
    setSearchParams(params);
  };

  const ActionButtons = () => (
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
  );

  return (
    <div className="mx-auto p-4 mt-5">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="font-bold text-blue-600 text-center"></h1>
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end order-last lg:order-none">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full">
              <div className="relative w-full flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="query"
                    id="search_query"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-gray-300 focus:border-gray-300 focus:shadow-outline"
                    placeholder="Enter descriptive keywords..."
                    autoComplete="off"
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {searchQuery && (
                    <div className="absolute right-0 inset-y-0 flex items-center">
                      <button
                        type="button"
                        className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                        onClick={() => setSearchQuery("")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex gap-2 justify-center">
                  <ActionButtons />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between gap-2">
              {showFilters && (
                <div className="mb-2 flex-grow">
                  <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
                </div>
              )}
            </div>
            <div className="sm:hidden w-full">
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[2rem]">
        <ReportsContainer
          query={activeSearch}
          page={currentPage}
          onPageChange={handlePageChange}
          filters={activeFilters}
        />
      </div>
    </div>
  );
};

export default ReportIndexPage;
