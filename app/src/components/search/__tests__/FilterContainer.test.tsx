import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterContainer from "../FilterContainer";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import speciesListJson from "../../../../../config/species.json";
import colorListJson from "../../../../../config/colors.json";
import genderListJson from "../../../../../config/genders.json";
// Mock the entire module with a default export
vi.mock("../../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: () => ({}),
    middleware: () => () => {}
  },
  useGetStatesQuery: () => ({ data: ["New York", "California"], isLoading: false }),
  useGetCitiesQuery: () => ({ data: ["Los Angeles", "New York City"], isLoading: false })
}));

describe("FilterContainer", () => {
  const mockInitialFilters = {
    species: "",
    breed: "",
    color: "",
    gender: "",
    country: "",
    state: "",
    area: "",
    sort: "Newest"
  };

  const mockOnFiltersChange = vi.fn();
  const mockOnReset = vi.fn();

  const renderComponent = (showFilters = true) => {
    return render(
      <Provider store={store}>
        <FilterContainer
          initialFilters={mockInitialFilters}
          onFiltersChange={mockOnFiltersChange}
          showFilters={showFilters}
          onReset={mockOnReset}
        />
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when showFilters is false", () => {
    renderComponent(false);
    expect(screen.queryByTestId("filters-container")).toBeNull();
  });

  it("renders filters when showFilters is true", () => {
    renderComponent(true);
    expect(screen.getByTestId("filters-container")).toBeDefined();
  });

  const getSelectOption = (selectElement: HTMLElement, value: string) => {
    const nativeInput = selectElement.querySelector("input[name]") as HTMLInputElement;
    fireEvent.change(nativeInput, { target: { value } });
  };

  it("handles species filter change", () => {
    renderComponent();
    const speciesSelect = screen.getByTestId("species-select");
    getSelectOption(speciesSelect, speciesListJson.options[0]);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      species: speciesListJson.options[0]
    });
  });

  it("handles color filter change", async () => {
    renderComponent();
    const colorSelect = screen.getByTestId("color-select");
    getSelectOption(colorSelect, colorListJson.options[0]);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      color: colorListJson.options[0]
    });
  });

  it("handles gender filter change", async () => {
    renderComponent();
    const genderSelect = screen.getByTestId("gender-select");
    getSelectOption(genderSelect, genderListJson.options[0]);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      gender: genderListJson.options[0]
    });
  });

  it("resets state and area when country changes", async () => {
    renderComponent();
    const countrySelect = screen.getByTestId("country-select");
    getSelectOption(countrySelect, "Canada");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      country: "Canada",
      state: "",
      area: ""
    });
  });

  it("resets area when state changes", async () => {
    const filtersWithCountry = {
      ...mockInitialFilters,
      country: "United States",
      state: "California",
      area: "Los Angeles"
    };

    render(
      <Provider store={store}>
        <FilterContainer
          initialFilters={filtersWithCountry}
          onFiltersChange={mockOnFiltersChange}
          showFilters={true}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const stateSelect = screen.getByTestId("state-select");
    getSelectOption(stateSelect, "New York");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithCountry,
      state: "New York",
      area: ""
    });
  });
});
