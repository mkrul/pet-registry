import { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import SearchContainer from "../../components/search/SearchContainer";
import MobileSearchTab from "../../components/search/MobileSearchTab";
import ReportsContainer from "../../components/reports/index/ReportsContainer";
import { FiltersProps } from "../../types/common/Search";

const ReportIndexPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSearch, setActiveSearch] = useState(searchParams.get("query") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [activeFilters, setActiveFilters] = useState<FiltersProps>({
    species: searchParams.get("species") || "",
    color: searchParams.get("color") || "",
    gender: searchParams.get("gender") || "",
    area: searchParams.get("area") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "",
    sort: searchParams.get("sort") || "Newest",
    breed: searchParams.get("breed") || ""
  });
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Effect to restore search state when returning from report detail
  useEffect(() => {
    const savedState = sessionStorage.getItem("reportSearchState");
    if (savedState) {
      const { query, filters, page, path } = JSON.parse(savedState);

      // Update state
      setActiveSearch(query || "");
      setActiveFilters(filters);
      setCurrentPage(page);

      // Update URL and clear saved state
      navigate(path, { replace: true });
      sessionStorage.removeItem("reportSearchState");
    }
  }, [location.pathname]);

  const handleSearchComplete = (query: string, page: number, filters: FiltersProps) => {
    setActiveSearch(query);
    setActiveFilters(filters);
    setCurrentPage(page);

    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (page > 1) params.set("page", page.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div className="mx-auto p-4 mt-5" data-testid="reports-index">
      <div className="flex flex-col gap-4">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <SearchContainer onSearchComplete={handleSearchComplete} />
        </div>

        {/* Mobile Search Tab */}
        <MobileSearchTab
          isOpen={isMobileSearchOpen}
          setIsOpen={setIsMobileSearchOpen}
          onSearchComplete={(query, page, filters) => {
            handleSearchComplete(query, page, filters);
            setIsMobileSearchOpen(false); // Close the search tab after search
          }}
        />

        <div>
          <ReportsContainer
            query={activeSearch}
            filters={activeFilters}
            page={currentPage}
            onPageChange={page => handleSearchComplete(activeSearch, page, activeFilters)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportIndexPage;
