import { FiltersProps } from "../types/common/Search";

export const getInitialFilters = (searchParams: URLSearchParams): FiltersProps => ({
  species: searchParams.get("species") || "",
  color: searchParams.get("color") || "",
  gender: searchParams.get("gender") || "",
  area: searchParams.get("area") || "",
  state: searchParams.get("state") || "",
  country: searchParams.get("country") || "",
  sort: searchParams.get("sort") || "Newest",
  breed: searchParams.get("breed") || ""
});

export const getDefaultFilters = (): FiltersProps => ({
  species: "",
  color: "",
  gender: "",
  area: "",
  state: "",
  country: "",
  sort: "Newest",
  breed: ""
});

export const updateSearchParams = (query: string, filters: FiltersProps) => {
  const newParams = new URLSearchParams();
  if (query) newParams.set("query", query);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) newParams.set(key, value);
  });
  return newParams;
};
