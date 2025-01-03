import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();
  const mockSetSearchQuery = vi.fn();
  const mockOnReset = vi.fn();
  const mockSetShowFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search bar component", () => {
    const { container } = render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders search input with correct placeholder", () => {
    render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toBeDefined();
    expect(searchInput).toHaveAttribute(
      "placeholder",
      "Enter keywords (e.g. 'black', 'female','cat', etc.)"
    );
  });

  it("calls setSearchQuery when input value changes", () => {
    render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test query" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("test query");
  });

  it("calls onSearch when Enter key is pressed", () => {
    render(
      <SearchBar
        searchQuery="test query"
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("displays the search query value in the input", () => {
    const testQuery = "test query";
    render(
      <SearchBar
        searchQuery={testQuery}
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    expect(searchInput.value).toBe(testQuery);
  });

  it("shows clear button when search query exists", () => {
    render(
      <SearchBar
        searchQuery="test query"
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const clearButton = screen.getByTestId("search-clear-button");
    expect(clearButton).toBeDefined();
  });

  it("clears search query when clear button is clicked", () => {
    render(
      <SearchBar
        searchQuery="test query"
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        showFilters={false}
        setShowFilters={mockSetShowFilters}
      />
    );

    const clearButton = screen.getByTestId("search-clear-button");
    fireEvent.click(clearButton);

    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
  });
});
