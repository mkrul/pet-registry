import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import ScrollToTop from "../common/ScrollToTop";
import { useLocation } from "react-router-dom";

// Mock window.scrollTo
const scrollToMock = vi.fn();
window.scrollTo = scrollToMock;

// Mock useLocation hook
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn()
}));

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "default"
    });
  });

  it("scrolls to top when pathname changes", () => {
    render(<ScrollToTop />);
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to top when pathname changes to a new route", () => {
    const { rerender } = render(<ScrollToTop />);
    expect(scrollToMock).toHaveBeenCalledTimes(1);

    // Simulate route change
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/new-route",
      search: "",
      hash: "",
      state: null,
      key: "default"
    });
    rerender(<ScrollToTop />);

    expect(scrollToMock).toHaveBeenCalledTimes(2);
    expect(scrollToMock).toHaveBeenLastCalledWith(0, 0);
  });

  it("does not scroll when pathname remains the same", () => {
    const { rerender } = render(<ScrollToTop />);
    expect(scrollToMock).toHaveBeenCalledTimes(1);

    // Rerender with same pathname
    rerender(<ScrollToTop />);

    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });
});
