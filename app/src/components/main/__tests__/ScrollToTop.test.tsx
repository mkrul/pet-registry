import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

// Mock window.scrollTo
const scrollToMock = vi.fn();
window.scrollTo = scrollToMock;

// Mock useLocation
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn()
}));

describe("ScrollToTop", () => {
  const mockLocation = {
    pathname: "/test",
    search: "",
    hash: "",
    state: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockLocation);
  });

  it("scrolls to top when location changes", () => {
    render(<ScrollToTop />);
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to top when pathname changes", () => {
    render(<ScrollToTop />);

    // Simulate location change
    const newLocation = { ...mockLocation, pathname: "/new-path" };
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(newLocation);

    // Re-render to trigger useEffect
    render(<ScrollToTop />);

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it("renders nothing to the DOM", () => {
    const { container } = render(<ScrollToTop />);
    expect(container.firstChild).toBeNull();
  });
});
