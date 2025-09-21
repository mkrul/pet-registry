import { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setSearchState } from "../../../store/features/search/searchSlice";
import SearchTab from "../../search/components/SearchTab";
import ReportsContainer from "../components/index/ReportsContainer";
import { useScrollRestoration } from "../../../shared/hooks/useScrollRestoration";
import { useReportsData } from "../../../shared/hooks/useReportsData";
import { useSearchParamsState } from "../../../shared/hooks/useSearchParams";

const ReportIndexPage = () => {
  const dispatch = useAppDispatch();
  const { searchParams, updateSearchParams, getInitialFilters } = useSearchParamsState();
  const searchState = useAppSelector(state => state.search);
  const initialFilters = useMemo(() => getInitialFilters(), [searchParams]);

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

  const { reports, isLoading } = useReportsData(activeSearch, activeFilters, currentPage);

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
          <ReportsContainer
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
