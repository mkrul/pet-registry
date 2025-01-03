import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import Filters from "../Filters";
import speciesListJson from "../../../../../config/species.json";
import colorListJson from "../../../../../config/colors.json";
import genderListJson from "../../../../../config/genders.json";
import sortOptionsJson from "../../../../../config/sort_options.json";

// Mock the reportsApi module
vi.mock("../../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: () => ({}),
    middleware: () => () => {}
  },
  useGetStatesQuery: () => ({ data: ["New York", "California"], isLoading: false }),
  useGetCitiesQuery: () => ({ data: ["Los Angeles", "New York City"], isLoading: false })
}));

describe("Filters", () => {
  const mockFilters = {
    species: "",
    breed: "",
    color: "",
    gender: "",
    country: "",
    state: "",
    area: "",
    sort: "Newest"
  };

  const mockHandleFilterChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter components", () => {
    const { container } = render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  const selectOption = (selectTestId: string, value: string) => {
    const select = screen.getByTestId(selectTestId);
    const nativeInput = select.querySelector(`input[name]`) as HTMLInputElement;
    const event = {
      target: { name: nativeInput.name, value }
    };
    mockHandleFilterChange(event);
  };

  it("renders species select", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const speciesSelect = screen.getByTestId("species-select");
    expect(speciesSelect).toBeDefined();
  });

  it("renders color select", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const colorSelect = screen.getByTestId("color-select");
    expect(colorSelect).toBeDefined();
  });

  it("renders gender select", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const genderSelect = screen.getByTestId("gender-select");
    expect(genderSelect).toBeDefined();
  });

  it("renders sort select", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    const sortSelect = screen.getByTestId("sort-select");
    expect(sortSelect).toBeDefined();
  });

  it("handles species filter change", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    selectOption("species-select", speciesListJson.options[0]);

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      target: { name: "species", value: speciesListJson.options[0] }
    });
  });

  it("handles color filter change", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    selectOption("color-select", colorListJson.options[0]);

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      target: { name: "color", value: colorListJson.options[0] }
    });
  });

  it("handles gender filter change", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    selectOption("gender-select", genderListJson.options[0]);

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      target: { name: "gender", value: genderListJson.options[0] }
    });
  });

  it("handles sort option change", () => {
    render(
      <Provider store={store}>
        <Filters
          filters={mockFilters}
          handleFilterChange={mockHandleFilterChange}
          onReset={mockOnReset}
        />
      </Provider>
    );

    selectOption("sort-select", sortOptionsJson.options[1]);

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      target: { name: "sort", value: sortOptionsJson.options[1] }
    });
  });
});
