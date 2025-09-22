import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export const useSearchParamsState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = useCallback(
    (query, page, filters) => {
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
    () => ({
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
