// src/pages/ReportIndexPage.tsx

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";

const ReportIndexPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("query") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(pageParam);
  }, [queryParam, pageParam]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    setSearchParams({ query, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ query: searchQuery, page: page.toString() });
  };

  return (
    <div className="md:w-95% mx-auto p-4 mt-5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-[30rem] md:order-2">
          <SearchBar onSearch={handleSearch} />
        </div>
        <h1 className="mt-3 text-3xl font-bold text-blue-600 md:order-1 md:text-left">Lost Pets</h1>
      </div>

      <div className="mt-[2rem]">
        <ReportsContainer query={searchQuery} />
      </div>
    </div>
  );
};

export default ReportIndexPage;
