import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useMapEvents } from "react-leaflet";
import Map from "../Map";

// Mock react-leaflet components
vi.mock("react-leaflet", () => {
  const actual = vi.importActual("react-leaflet");
  return {
    ...actual,
    MapContainer: ({ children, center, zoom }: any) => (
      <div data-testid="map-container" data-center={JSON.stringify(center)} data-zoom={zoom}>
        {children}
      </div>
    ),
    TileLayer: ({ url, attribution }: any) => (
      <div data-testid="tile-layer" data-url={url} data-attribution={attribution} />
    ),
    Marker: ({ position }: any) => (
      <div data-testid="map-marker" data-position={JSON.stringify(position)} />
    ),
    useMapEvents: vi.fn()
  };
});

// Mock leaflet
vi.mock("leaflet", () => ({
  default: {
    marker: () => ({
      addTo: vi.fn(),
      remove: vi.fn()
    })
  }
}));

// Mock Spinner component
vi.mock("../Spinner", () => ({
  default: ({ size, className }: any) => (
    <div data-testid="spinner" data-size={size} className={className} />
  )
}));

describe("Map", () => {
  const mockOnLocationSelect = vi.fn();
  const mockLocation = {
    latitude: 40.7128,
    longitude: -74.006,
    area: "New York",
    state: "NY",
    country: "USA"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders map with default center when no initial location", () => {
    render(<Map onLocationSelect={mockOnLocationSelect} />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toBeDefined();
    expect(mapContainer.dataset.center).toBe(JSON.stringify([39.8283, -98.5795]));
    expect(mapContainer.dataset.zoom).toBe("15");
  });

  it("renders map with initial location when provided", () => {
    render(<Map onLocationSelect={mockOnLocationSelect} initialLocation={mockLocation} />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toBeDefined();
    expect(mapContainer.dataset.center).toBe(
      JSON.stringify([mockLocation.latitude, mockLocation.longitude])
    );
  });

  it("shows marker when initial location is provided", () => {
    render(<Map onLocationSelect={mockOnLocationSelect} initialLocation={mockLocation} />);

    const marker = screen.getByTestId("map-marker");
    expect(marker).toBeDefined();
    expect(marker.dataset.position).toBe(
      JSON.stringify([mockLocation.latitude, mockLocation.longitude])
    );
  });

  it("shows loading spinner initially", () => {
    render(<Map onLocationSelect={mockOnLocationSelect} />);

    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeDefined();
    expect(spinner).toHaveClass("text-gray-300");
  });

  it("renders in read-only mode correctly", () => {
    render(
      <Map onLocationSelect={mockOnLocationSelect} initialLocation={mockLocation} readOnly={true} />
    );

    const mapEvents = screen.queryByTestId("map-events");
    expect(mapEvents).toBeNull();
  });

  it("handles location selection correctly", async () => {
    const mockGeocodingResponse = {
      address: {
        area: "Manhattan",
        state: "New York",
        country: "USA"
      }
    };

    (global.fetch as unknown as MockInstance).mockResolvedValueOnce({
      json: () => Promise.resolve(mockGeocodingResponse)
    });

    let clickHandler: (e: any) => Promise<void>;
    (useMapEvents as unknown as MockInstance).mockImplementation(({ click }) => {
      clickHandler = click;
      return { remove: vi.fn() };
    });

    render(<Map onLocationSelect={mockOnLocationSelect} />);

    // Simulate map click
    await act(async () => {
      await clickHandler({ latlng: { lat: 40.7128, lng: -74.006 } });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org")
    );
    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      latitude: 40.7128,
      longitude: -74.006,
      area: "Manhattan",
      state: "New York",
      country: "USA"
    });
  });

  it("handles geocoding errors gracefully", async () => {
    (global.fetch as unknown as MockInstance).mockRejectedValueOnce(new Error("Geocoding failed"));

    let clickHandler: (e: any) => Promise<void>;
    (useMapEvents as unknown as MockInstance).mockImplementation(({ click }) => {
      clickHandler = click;
      return { remove: vi.fn() };
    });

    render(<Map onLocationSelect={mockOnLocationSelect} />);

    await act(async () => {
      await clickHandler({ latlng: { lat: 40.7128, lng: -74.006 } });
    });

    expect(mockOnLocationSelect).not.toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <Map onLocationSelect={mockOnLocationSelect} initialLocation={mockLocation} />
    );
    expect(container).toMatchSnapshot();
  });
});
