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
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    sort: sortParam
  });
  const [pendingFilters, setPendingFilters] = useState({
    species: speciesParam,
    color: colorParam,
    gender: genderParam,
    sort: sortParam
  });

  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(pageParam);
    setPendingFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      sort: sortParam
    });
    setActiveFilters({
      species: speciesParam,
      color: colorParam,
      gender: genderParam,
      sort: sortParam
    });
  }, [queryParam, pageParam, speciesParam, colorParam, genderParam, sortParam]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveSearch(query);
    setCurrentPage(1);
    setActiveFilters(pendingFilters);
    updateSearchParams(query, 1, pendingFilters);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    const defaultFilters = {
      species: "",
      color: "",
      gender: "",
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
    const params: Record<string, string> = { page: page.toString() };
    if (query) params.query = query;
    if (currentFilters.species) params.species = currentFilters.species;
    if (currentFilters.color) params.color = currentFilters.color;
    if (currentFilters.gender) params.gender = currentFilters.gender;
    if (currentFilters.sort) params.sort = currentFilters.sort;
    setSearchParams(params);
  };

  const ActionButtons = () => (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => handleSearch(searchQuery)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Search
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
      <div className="md:pl-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Lost Pets</h1>
        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-end order-last lg:order-none sm:mt-2">
          <div className="w-full max-w-xl flex flex-col gap-2">
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
                        handleSearch(searchQuery);
                      }
                    }}
                    className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-gray-300 focus:border-gray-300 focus:shadow-outline"
                    placeholder="Enter breed and descriptive keywords..."
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
            <div className="w-full">
              <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
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
