import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { FiltersProps } from "../types/common/Search";

interface SearchParamsState {
  searchParams: URLSearchParams;
  updateSearchParams: (query: string, page: number, filters: FiltersProps) => void;
  getInitialFilters: () => FiltersProps;
}

export const useSearchParamsState = (): SearchParamsState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = useCallback(
    (query: string, page: number, filters: FiltersProps) => {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (page > 1) params.set("page", page.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const getInitialFilters = useCallback(
    (): FiltersProps => ({
      species: searchParams.get("species") || "",
      color: searchParams.get("color") || "",
      gender: searchParams.get("gender") || "",
      area: searchParams.get("area") || "",
      state: searchParams.get("state") || "",
      country: searchParams.get("country") || "",
      sort: searchParams.get("sort") || "Newest",
      breed: searchParams.get("breed") || ""
    }),
    [searchParams]
  );

  return {
    searchParams,
    updateSearchParams,
    getInitialFilters
  };
};
