import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import { IFilters, ISearchContainer } from "../../types/search/Search";

const SearchContainer: React.FC<{
  onSearchComplete: (query: string, page: number, filters: IFilters) => void;
}> = ({ onSearchComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<IFilters>({
    species: searchParams.get("species") || "",
    color: searchParams.get("color") || "",
    gender: searchParams.get("gender") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "",
    sort: searchParams.get("sort") || "Newest",
    breed: searchParams.get("breed") || ""
  });

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    setSearchQuery(queryParam);

    setPendingFilters({
      species: searchParams.get("species") || "",
      color: searchParams.get("color") || "",
      gender: searchParams.get("gender") || "",
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      sort: searchParams.get("sort") || "Newest",
      breed: searchParams.get("breed") || ""
    });
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
    onSearchComplete(searchQuery, 1, pendingFilters);
  };

  const handleReset = () => {
    const defaultFilters: IFilters = {
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
    setPendingFilters(defaultFilters);
    setSearchParams({});
    onSearchComplete("", 1, defaultFilters);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: filterType, value } = e.target;
    const updatedFilters =
      filterType === "country"
        ? { ...pendingFilters, [filterType]: value, state: "", city: "" }
        : filterType === "state"
          ? { ...pendingFilters, [filterType]: value, city: "" }
          : { ...pendingFilters, [filterType]: value };

    setPendingFilters(updatedFilters);
  };

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onReset={handleReset}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {showFilters && (
        <div className="w-full">
          <Filters filters={pendingFilters} handleFilterChange={handleFilterChange} />
        </div>
      )}
    </>
  );
};

export default SearchContainer;
