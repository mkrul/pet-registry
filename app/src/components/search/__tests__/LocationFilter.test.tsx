import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import LocationFilter from "../LocationFilter";

// Mock the reportsApi module
vi.mock("../../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: () => ({}),
    middleware: () => () => {}
  },
  useGetStatesQuery: () => ({
    data: ["New York", "California"],
    isLoading: false
  }),
  useGetCitiesQuery: () => ({
    data: ["Los Angeles", "New York City"],
    isLoading: false
  })
}));

describe("LocationFilter", () => {
  const mockSelectClassName = {
    height: "40px",
    backgroundColor: "white"
  };

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all location filters", () => {
    const { container } = render(
      <Provider store={store}>
        <LocationFilter
          country=""
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders country select", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country=""
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    const countrySelect = screen.getByTestId("country-select");
    expect(countrySelect).toBeDefined();
  });

  it("renders state select disabled when no country selected", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country=""
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    const stateSelect = screen.getByTestId("state-select");
    expect(stateSelect).toBeDefined();
    expect(stateSelect.querySelector("input")).toBeDisabled();
  });

  it("renders area select disabled when no state selected", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country="United States"
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    const areaSelect = screen.getByTestId("area-select");
    expect(areaSelect).toBeDefined();
    expect(areaSelect.querySelector("input")).toBeDisabled();
  });

  it("enables state select when country is selected", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country="United States"
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    const stateSelect = screen.getByTestId("state-select");
    expect(stateSelect.querySelector("input")).not.toBeDisabled();
  });

  it("enables area select when state is selected", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country="United States"
          state="California"
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    const areaSelect = screen.getByTestId("area-select");
    expect(areaSelect.querySelector("input")).not.toBeDisabled();
  });

  const selectOption = (selectTestId: string, value: string) => {
    const select = screen.getByTestId(selectTestId);
    const nativeInput = select.querySelector(`input[name]`) as HTMLInputElement;
    const event = {
      target: { name: nativeInput.name, value }
    };
    mockOnFilterChange(event);
  };

  it("handles country selection", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country=""
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    selectOption("country-select", "United States");

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      target: { name: "country", value: "United States" }
    });
  });

  it("handles state selection", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country="United States"
          state=""
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    selectOption("state-select", "California");

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      target: { name: "state", value: "California" }
    });
  });

  it("handles area selection", () => {
    render(
      <Provider store={store}>
        <LocationFilter
          country="United States"
          state="California"
          area=""
          onFilterChange={mockOnFilterChange}
          selectClassName={mockSelectClassName}
          disabledSelectClassName={mockSelectClassName}
        />
      </Provider>
    );

    selectOption("area-select", "Los Angeles");

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      target: { name: "area", value: "Los Angeles" }
    });
  });
});
