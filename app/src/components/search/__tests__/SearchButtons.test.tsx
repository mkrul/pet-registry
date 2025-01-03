import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchButtons from "../SearchButtons";

describe("SearchButtons", () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();
  const mockSetShowFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search buttons container", () => {
    const { container } = render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders all buttons", () => {
    render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    expect(screen.getByTestId("search-button")).toBeDefined();
    expect(screen.getByTestId("show-filters-button")).toBeDefined();
    expect(screen.getByTestId("reset-button")).toBeDefined();
  });

  it("calls onSearch when search button is clicked", () => {
    render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const searchButton = screen.getByTestId("search-button");
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("calls onReset when reset button is clicked", () => {
    render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("toggles filters when show filters button is clicked", () => {
    render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const filtersButton = screen.getByTestId("show-filters-button");
    fireEvent.click(filtersButton);

    expect(mockSetShowFilters).toHaveBeenCalledWith(true);
  });

  it("shows correct text on filters button based on showFilters prop", () => {
    const { rerender } = render(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const filtersButton = screen.getByTestId("show-filters-button");
    expect(filtersButton.textContent).toBe("Show filters");

    rerender(
      <SearchButtons
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={true}
        setShowFilters={mockSetShowFilters}
      />
    );

    expect(filtersButton.textContent).toBe("Hide filters");
  });
});
