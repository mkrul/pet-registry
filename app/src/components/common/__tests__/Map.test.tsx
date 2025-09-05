import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, act } from "@testing-library/react";
import Map from "../Map";
import { MapProps } from "../../../types/common/Map";

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

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  useMapEvents: (handlers: { click: (e: any) => void }) => {
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

    const mockClickEvent = {
      latlng: {
        lat: 40.7128,
        lng: -74.006
      }
    };

    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse")
    );

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

    const mockClickEvent = {
      latlng: {
        lat: 43.6532,
        lng: -79.3832
      }
    };

    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse")
    );

    await waitFor(() => {
      expect(mockOnLocationSelect).not.toHaveBeenCalled();
    });
  });

  it("shows notification for non-US location selection", async () => {
    const { getByRole } = render(<Map {...defaultProps} />);

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

    const mockClickEvent = {
      latlng: {
        lat: 43.6532,
        lng: -79.3832
      }
    };

    await act(async () => {
      await (global as any).mockMapClick(mockClickEvent);
    });

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

    await waitFor(() => {
      const alert = getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(
        "Sorry, we are only able to support US locations at this time."
      );
    });

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

    await waitFor(() => {
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
