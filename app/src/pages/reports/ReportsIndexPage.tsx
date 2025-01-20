import { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setSearchState } from "../../redux/features/search/searchSlice";
import SearchContainer from "../../components/search/SearchContainer";
import MobileSearchTab from "../../components/search/MobileSearchTab";
import ReportsContainer from "../../components/reports/index/ReportsContainer";
import { FiltersProps } from "../../types/common/Search";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { store } from "../../redux/store";

const ReportIndexPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search state from Redux
  const searchState = useAppSelector(state => state.search);

  const [activeSearch, setActiveSearch] = useState(
    searchState.query || searchParams.get("query") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    searchState.page || parseInt(searchParams.get("page") || "1")
  );
  const [activeFilters, setActiveFilters] = useState<FiltersProps>(
    searchState.filters || {
      species: searchParams.get("species") || "",
      color: searchParams.get("color") || "",
      gender: searchParams.get("gender") || "",
      area: searchParams.get("area") || "",
      state: searchParams.get("state") || "",
      country: searchParams.get("country") || "",
      sort: searchParams.get("sort") || "Newest",
      breed: searchParams.get("breed") || ""
    }
  );
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    console.log("ReportsIndexPage mounted", {
      searchState,
      currentPage,
      activeSearch,
      activeFilters,
      scrollY: window.scrollY
    });
  }, []);

  useScrollRestoration();

  const handleSearchComplete = (query: string, page: number, filters: FiltersProps) => {
    // Scroll to top immediately when page changes
    if (page !== currentPage) {
      window.scrollTo(0, 0);
    }

    console.log("handleSearchComplete called", {
      query,
      page,
      filters,
      currentScrollY: window.scrollY
    });

    setActiveSearch(query);
    setActiveFilters(filters);
    setCurrentPage(page);

    console.log("Before dispatching setSearchState", {
      query,
      page,
      filters,
      scrollPosition: window.scrollY
    });

    // Save search state to Redux
    dispatch(
      setSearchState({
        query,
        page,
        filters,
        scrollPosition: window.scrollY
      })
    );

    console.log("After dispatching setSearchState", {
      newScrollY: window.scrollY,
      reduxState: store.getState().search
    });

    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (page > 1) params.set("page", page.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    console.log("Before setting search params", {
      params: params.toString(),
      currentURL: window.location.href
    });

    setSearchParams(params);

    console.log("After setting search params", {
      newURL: window.location.href,
      finalScrollY: window.scrollY
    });
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
            setIsMobileSearchOpen(false);
          }}
        />

        <div>
          <ReportsContainer
            key={currentPage}
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
