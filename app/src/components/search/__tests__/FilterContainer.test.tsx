import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FilterContainer from "../FilterContainer";
import { FilterContainerProps } from "../../../types/common/Search";

// Move mocks before imports to ensure they're registered first
vi.mock("../../../redux/features/reports/reportsApi", () => ({
  useGetStatesQuery: () => ({
    data: ["California", "Nevada"],
    isLoading: false,
    refetch: vi.fn()
  }),
  useGetAreasQuery: () => ({
    data: ["Los Angeles", "San Francisco"],
    isLoading: false,
    refetch: vi.fn()
  }),
  useGetCitiesQuery: () => ({
    data: ["Los Angeles", "San Francisco"],
    isLoading: false,
    refetch: vi.fn()
  })
}));

vi.mock("../../../redux/features/filters/filtersApi", () => ({
  useGetStatesQuery: () => ({
    data: ["California", "Nevada"],
    isLoading: false,
    refetch: vi.fn()
  }),
  useGetAreasQuery: () => ({
    data: ["Los Angeles", "San Francisco"],
    isLoading: false,
    refetch: vi.fn()
  }),
  useGetCitiesQuery: () => ({
    data: ["Los Angeles", "San Francisco"],
    isLoading: false,
    refetch: vi.fn()
  })
}));

describe("FilterContainer", () => {
  const mockInitialFilters: FilterContainerProps["initialFilters"] = {
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

  // Create a mock store with both APIs
  const store = configureStore({
    reducer: {
      filtersApi: (state = {}) => state,
      reportsApi: (state = {}) => state
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat([
        () => next => action => next(action), // filtersApi middleware
        () => next => action => next(action) // reportsApi middleware
      ])
  });

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
    const { container } = renderComponent(false);
    expect(container.firstChild).toBeNull();
  });

  it("renders filters when showFilters is true", () => {
    renderComponent();
    const speciesSelect = screen.getByTestId("species-select");
    const colorSelect = screen.getByTestId("color-select");
    const genderSelect = screen.getByTestId("gender-select");

    expect(speciesSelect).toBeDefined();
    expect(colorSelect).toBeDefined();
    expect(genderSelect).toBeDefined();
  });

  it("calls onFiltersChange when a filter value changes", async () => {
    renderComponent();
    const speciesSelect = screen.getByTestId("species-select");
    fireEvent.mouseDown(speciesSelect);

    // Wait for the menu to appear and select option
    const speciesOption = await screen.findByText("Dog");
    fireEvent.click(speciesOption);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      species: "Dog"
    });
  });

  it("resets state and area when country changes", () => {
    const filtersWithValues = {
      ...mockInitialFilters,
      country: "United States",
      state: "California",
      area: "Los Angeles"
    };

    render(
      <Provider store={store}>
        <FilterContainer
          initialFilters={filtersWithValues}
          onFiltersChange={mockOnFiltersChange}
          showFilters={true}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const countrySelect = screen.getByTestId("country-select");
    fireEvent.mouseDown(countrySelect);

    const canadaOption = screen.findByText("Canada");
    fireEvent.click(canadaOption);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithValues,
      country: "Canada",
      state: "",
      area: ""
    });
  });

  it("resets area when state changes", () => {
    const filtersWithValues = {
      ...mockInitialFilters,
      country: "United States",
      state: "California",
      area: "Los Angeles"
    };

    render(
      <Provider store={store}>
        <FilterContainer
          initialFilters={filtersWithValues}
          onFiltersChange={mockOnFiltersChange}
          showFilters={true}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const stateSelect = screen.getByTestId("state-select");
    fireEvent.mouseDown(stateSelect);

    const nevadaOption = screen.findByText("Nevada");
    fireEvent.click(nevadaOption);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithValues,
      state: "Nevada",
      area: ""
    });
  });

  it("matches snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
