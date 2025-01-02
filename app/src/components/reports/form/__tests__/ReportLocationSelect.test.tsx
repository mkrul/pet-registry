import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ReportLocationSelect } from "../ReportLocationSelect";
import Map from "../../../common/Map";
import LocationDisplay from "../../../common/LocationDisplay";

// Mock both components before tests
vi.mock("../../../common/LocationDisplay", () => ({
  default: vi.fn(({ area, state, country }) => (
    <div data-testid="mock-location-display">{`${area}, ${state}, ${country}`}</div>
  ))
}));

vi.mock("../../../common/Map", () => ({
  default: vi.fn(({ onLocationSelect }) => {
    const mockLocation = {
      latitude: -33.865143,
      longitude: 151.2099,
      area: "Sydney",
      state: "NSW",
      country: "Australia"
    };

    return (
      <div data-testid="mock-map">
        <button
          type="button"
          onClick={() => onLocationSelect(mockLocation)}
          data-testid="mock-location-select"
        >
          Select Location
        </button>
      </div>
    );
  })
}));

describe("ReportLocationSelect", () => {
  const mockLocation = {
    latitude: -33.865143,
    longitude: 151.2099,
    area: "Sydney",
    state: "NSW",
    country: "Australia"
  };

  const mockOnLocationSelect = vi.fn();
  const defaultProps = {
    onLocationSelect: mockOnLocationSelect
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders correctly", () => {
    const { container } = render(<ReportLocationSelect {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("displays the location label", () => {
    render(<ReportLocationSelect {...defaultProps} />);
    const label = screen.getByText("Location");
    expect(label).toBeDefined();
  });

  it("renders the Map component", () => {
    render(<ReportLocationSelect {...defaultProps} />);
    const map = screen.getByTestId("mock-map");
    expect(map).toBeDefined();
  });

  it("handles location selection", () => {
    render(<ReportLocationSelect {...defaultProps} />);

    const selectButton = screen.getByTestId("mock-location-select");
    fireEvent.click(selectButton);

    expect(mockOnLocationSelect).toHaveBeenCalledWith(mockLocation);
  });

  it("displays location details after selection", () => {
    render(<ReportLocationSelect {...defaultProps} />);

    const selectButton = screen.getByTestId("mock-location-select");
    fireEvent.click(selectButton);

    const locationDisplay = screen.getByTestId("location-display");
    expect(locationDisplay).toBeDefined();

    const mockLocationDisplay = screen.getByTestId("mock-location-display");
    expect(mockLocationDisplay).toHaveTextContent("Sydney, NSW, Australia");
  });

  it("maintains location display state between rerenders", () => {
    const { rerender } = render(<ReportLocationSelect {...defaultProps} />);

    // Initial selection
    const selectButton = screen.getByTestId("mock-location-select");
    fireEvent.click(selectButton);

    // Verify initial display
    expect(screen.getByTestId("location-display")).toBeDefined();

    // Rerender and verify persistence
    rerender(<ReportLocationSelect {...defaultProps} />);
    expect(screen.getByTestId("location-display")).toBeDefined();
  });
});
