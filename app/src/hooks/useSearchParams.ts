import { useSearchParams } from "react-router-dom";
import { FiltersProps } from "../types/common/Search";
import { getInitialFilters, updateSearchParams } from "../utils/filterUtils";

export const useSearchParamsState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (query: string, filters: FiltersProps) => {
    const newParams = updateSearchParams(query, filters);
    setSearchParams(newParams);
  };

  return {
    initialQuery: searchParams.get("query") || "",
    initialFilters: getInitialFilters(searchParams),
    updateParams
  };
};
