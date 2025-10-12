import { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks.js";
import { setSearchState } from "../../../store/features/search/searchSlice.js";
import SearchTab from "../../search/components/SearchTab.jsx";
import ListingsContainer from "../components/ListingContainer.jsx";
import { useScrollRestoration } from "../../../shared/hooks/useScrollRestoration.js";
import { useSearchParamsState } from "../../../shared/hooks/useSearchParams.js";

const ReportIndexPage = () => {
  console.log("📊 ReportIndexPage: Component rendering");
  const dispatch = useAppDispatch();
  const { searchParams, updateSearchParams, getInitialFilters } = useSearchParamsState();
  const searchState = useAppSelector(state => state.search);
  const initialFilters = useMemo(() => getInitialFilters(), [searchParams]);

  console.log("📊 ReportIndexPage: Search state:", searchState);
  console.log("📊 ReportIndexPage: Initial filters:", initialFilters);

  const [activeSearch, setActiveSearch] = useState(
    searchState.query || searchParams.get("query") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    searchState.page || parseInt(searchParams.get("page") || "1")
  );
  const [activeFilters, setActiveFilters] = useState(
    searchState.filters || initialFilters
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useScrollRestoration();

  const handleSearchComplete = useCallback(
    (query, page, filters) => {
      if (page !== currentPage) {
        window.scrollTo(0, 0);
      }

      setActiveSearch(query);
      setActiveFilters(filters);
      setCurrentPage(page);

      dispatch(
        setSearchState({
          query,
          page,
          filters,
          scrollPosition: window.scrollY
        })
      );

      updateSearchParams(query, page, filters);
    },
    [currentPage, dispatch, updateSearchParams]
  );

  const handlePageChange = useCallback(
    (page) => {
      handleSearchComplete(activeSearch, page, activeFilters);
    },
    [activeSearch, activeFilters, handleSearchComplete]
  );

  const handleSearchTabComplete = useCallback(
    (query, page, filters) => {
      handleSearchComplete(query, page, filters);
      setIsSearchOpen(false);
    },
    [handleSearchComplete, setIsSearchOpen]
  );

  return (
    <div className="mx-auto p-4" data-testid="reports-index">
      <div className="flex flex-col gap-4">
        <SearchTab
          isOpen={isSearchOpen}
          setIsOpen={setIsSearchOpen}
          onSearchComplete={handleSearchTabComplete}
        />

        <div>
          <ListingsContainer
            key={currentPage}
            query={activeSearch}
            filters={activeFilters}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportIndexPage;
