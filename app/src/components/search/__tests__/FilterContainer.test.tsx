import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FilterContainer from "../FilterContainer";
import { FilterValues } from "../../../types/common/Search";

// Mock both APIs
vi.mock("../../../redux/features/filters/filtersApi", () => ({
  filtersApi: {
    reducerPath: "filtersApi",
    reducer: () => ({}),
    middleware: () => next => action => next(action),
    useGetStatesQuery: () => ({
      data: ["California", "Nevada"],
      isLoading: false
    }),
    useGetAreasQuery: () => ({
      data: ["Los Angeles", "San Francisco"],
      isLoading: false
    })
  }
}));

vi.mock("../../../redux/features/reports/reportsApi", () => ({
  reportsApi: {
    reducerPath: "reportsApi",
    reducer: () => ({}),
    middleware: () => next => action => next(action)
  }
}));

describe("FilterContainer", () => {
  const mockInitialFilters: FilterValues = {
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
    const speciesSelect = screen.getByRole("button", { name: /species/i });
    const colorSelect = screen.getByRole("button", { name: /color/i });
    const genderSelect = screen.getByRole("button", { name: /gender/i });

    expect(speciesSelect).toBeDefined();
    expect(colorSelect).toBeDefined();
    expect(genderSelect).toBeDefined();
  });

  it("calls onFiltersChange when a filter value changes", async () => {
    renderComponent();
    const speciesSelect = screen.getByRole("button", { name: /species/i });
    fireEvent.mouseDown(speciesSelect);

    const dogOption = screen.getByRole("option", { name: /dog/i });
    fireEvent.click(dogOption);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      species: "Dog"
    });
  });

  it("resets state and area when country changes", () => {
    const filtersWithValues = {
      ...mockInitialFilters,
      country: "USA",
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

    const countrySelect = screen.getByRole("button", { name: /usa/i });
    fireEvent.mouseDown(countrySelect);

    const canadaOption = screen.getByRole("option", { name: /canada/i });
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
      country: "USA",
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

    const stateSelect = screen.getByRole("button", { name: /california/i });
    fireEvent.mouseDown(stateSelect);

    const nevadaOption = screen.getByRole("option", { name: /nevada/i });
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
