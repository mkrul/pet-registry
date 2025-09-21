
const SEARCH_PERSISTENCE_KEY = "petRegistrySearchFilters";
const SEARCH_QUERY_KEY = "petRegistrySearchQuery";

export const getInitialFilters = (searchParams) => {
  // First check URL params
  const urlFilters = {
    species: searchParams.get("species") || "",
    color: searchParams.get("color") || "",
    gender: searchParams.get("gender") || "",
    area: searchParams.get("area") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "",
    sort: searchParams.get("sort") || "Newest",
    breed: searchParams.get("breed") || ""
  };

  // If URL has any filters, use them (URL takes precedence)
  const hasUrlFilters = Object.values(urlFilters).some(value => value && value !== "Newest");
  if (hasUrlFilters) {
    return urlFilters;
  }

  // Otherwise, check localStorage for saved filters
  try {
    const savedFilters = localStorage.getItem(SEARCH_PERSISTENCE_KEY);
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      return { ...getDefaultFilters(), ...parsed };
    }
  } catch (error) {
    console.warn("Failed to load saved search filters:", error);
  }

  return getDefaultFilters();
};

export const getInitialSearchQuery = (searchParams) => {
  // First check URL params
  const urlQuery = searchParams.get("query") || "";
  if (urlQuery) {
    return urlQuery;
  }

  // Otherwise, check localStorage for saved query
  try {
    const savedQuery = localStorage.getItem(SEARCH_QUERY_KEY);
    if (savedQuery) {
      return savedQuery;
    }
  } catch (error) {
    console.warn("Failed to load saved search query:", error);
  }

  return "";
};

export const getDefaultFilters = () => ({
  species: "",
  color: "",
  gender: "",
  area: "",
  state: "",
  country: "",
  sort: "Newest",
  breed: ""
});

export const saveSearchToLocalStorage = (query, filters) => {
  try {
    // Only save non-default values
    const filtersToSave = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (key === "sort") return value !== "Newest";
        return value !== "";
      })
    );

    localStorage.setItem(SEARCH_PERSISTENCE_KEY, JSON.stringify(filtersToSave));
    localStorage.setItem(SEARCH_QUERY_KEY, query);
  } catch (error) {
    console.warn("Failed to save search to localStorage:", error);
  }
};

export const clearSearchFromLocalStorage = () => {
  try {
    localStorage.removeItem(SEARCH_PERSISTENCE_KEY);
    localStorage.removeItem(SEARCH_QUERY_KEY);
  } catch (error) {
    console.warn("Failed to clear search from localStorage:", error);
  }
};

export const updateSearchParams = (query, filters) => {
  const newParams = new URLSearchParams();
  if (query) newParams.set("query", query);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) newParams.set(key, value);
  });
  return newParams;
};
