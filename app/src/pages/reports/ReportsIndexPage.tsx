import { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setSearchState } from "../../redux/features/search/searchSlice";
import SearchTab from "../../components/search/SearchTab";
import ReportsContainer from "../../components/reports/index/ReportsContainer";
import { FiltersProps } from "../../types/common/Search";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { useReportsData } from "../../hooks/useReportsData";
import { useSearchParamsState } from "../../hooks/useSearchParams";

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
  const [activeFilters, setActiveFilters] = useState<FiltersProps>(
    searchState.filters || initialFilters
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { reports, isLoading } = useReportsData(activeSearch, activeFilters, currentPage);

  useScrollRestoration();

  const handleSearchComplete = useCallback(
    (query: string, page: number, filters: FiltersProps) => {
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
    (page: number) => {
      handleSearchComplete(activeSearch, page, activeFilters);
    },
    [activeSearch, activeFilters, handleSearchComplete]
  );

  const handleSearchTabComplete = useCallback(
    (query: string, page: number, filters: FiltersProps) => {
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
