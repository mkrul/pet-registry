import React, { useState } from "react";
import SearchBar from "../../components/shared/SearchBar";
import ReportsContainer from "../../components/reports/ReportsContainer";

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

export default ReportsPage;
