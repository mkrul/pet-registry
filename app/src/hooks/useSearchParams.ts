import { useSearchParams } from "react-router-dom";
import { IFilters } from "../types/search/Search";
import { getInitialFilters, updateSearchParams } from "../utils/filterUtils";

export const useSearchParamsState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (query: string, filters: IFilters) => {
    const newParams = updateSearchParams(query, filters);
    setSearchParams(newParams);
  };

  return {
    initialQuery: searchParams.get("query") || "",
    initialFilters: getInitialFilters(searchParams),
    updateParams
  };
};
