import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, act } from "@testing-library/react";
import Map from "../Map";
import { MapProps } from "../../../types/common/Map";

// Mock Leaflet
const mockAddTo = vi.fn();
const mockRemove = vi.fn();
vi.mock("leaflet", () => ({
  default: {
    marker: () => ({
      addTo: mockAddTo,
      remove: mockRemove
    })
  }
}));

// Mock Leaflet and its components
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  useMapEvents: (handlers: { click: (e: any) => void }) => {
    // Store the click handler for testing
    (global as any).mockMapClick = handlers.click;
    return { remove: vi.fn() };
  },
  Marker: () => null
}));

describe("Map", () => {
  const mockOnLocationSelect = vi.fn();
  const defaultProps: MapProps = {
    onLocationSelect: mockOnLocationSelect,
    initialLocation: undefined,
    initialZoom: 15
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful US location response
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            address: {
              area: "Manhattan",
              state: "New York",
              country: "United States",
              town: "New York City",
              suburb: "Downtown"
            }
          })
      })
    );
  });

  it("handles location selection correctly", async () => {
    render(<Map {...defaultProps} />);

    // Simulate map click
    const mockClickEvent = {
      latlng: {
        lat: 40.7128,
        lng: -74.006
      }
    };

    // Trigger the stored click handler with act
    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

    // Verify the fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse")
    );

    // Verify onLocationSelect was called with correct data
    await waitFor(() => {
      expect(mockOnLocationSelect).toHaveBeenCalledWith({
        latitude: 40.7128,
        longitude: -74.006,
        area: "Manhattan",
        state: "New York",
        country: "United States"
      });
    });
  });

  it("handles non-US location selection correctly", async () => {
    // Mock non-US location response
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            address: {
              area: "Toronto",
              state: "Ontario",
              country: "Canada",
              town: "Toronto",
              suburb: "Downtown"
            }
          })
      })
    );

    render(<Map {...defaultProps} />);

    // Simulate map click
    const mockClickEvent = {
      latlng: {
        lat: 43.6532,
        lng: -79.3832
      }
    };

    // Trigger the stored click handler with act
    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

    // Verify the fetch call was made
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse")
    );

    // Verify onLocationSelect was NOT called for non-US location
    await waitFor(() => {
      expect(mockOnLocationSelect).not.toHaveBeenCalled();
    });
  });

  it("shows notification for non-US location selection", async () => {
    const { getByRole } = render(<Map {...defaultProps} />);

    // Mock non-US location response
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            address: {
              area: "Toronto",
              state: "Ontario",
              country: "Canada",
              town: "Toronto",
              suburb: "Downtown"
            }
          })
      })
    );

    // Simulate map click
    const mockClickEvent = {
      latlng: {
        lat: 43.6532,
        lng: -79.3832
      }
    };

    // Trigger the stored click handler with act
    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

    // Wait for notification to appear and verify its content
    await waitFor(() => {
      const alert = getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(
        "Sorry, we are only able to support US locations at this time."
      );
    });
  });

  it("clears notification when selecting US location", async () => {
    const { getByRole, queryByRole } = render(<Map {...defaultProps} />);

    // First click on non-US location
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            address: {
              area: "Toronto",
              state: "Ontario",
              country: "Canada",
              town: "Toronto",
              suburb: "Downtown"
            }
          })
      })
    );

    await act(async () => {
      await (global as any).mockMapClick({
        latlng: { lat: 43.6532, lng: -79.3832 }
      });
    });

    // Verify notification is shown
    await waitFor(() => {
      const alert = getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(
        "Sorry, we are only able to support US locations at this time."
      );
    });

    // Then click on US location
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            address: {
              area: "Manhattan",
              state: "New York",
              country: "United States",
              town: "New York City",
              suburb: "Downtown"
            }
          })
      })
    );

    await act(async () => {
      await (global as any).mockMapClick({
        latlng: { lat: 40.7128, lng: -74.006 }
      });
    });

    // Verify notification is cleared
    await waitFor(() => {
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
