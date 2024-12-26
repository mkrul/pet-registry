import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Spinner from "../shared/Spinner";

describe("Spinner", () => {
  it("renders with default styling", () => {
    render(<Spinner />);
    const spinner = screen.getByTestId("spinner");

    expect(spinner).toBeDefined();
    expect(spinner).toHaveClass(
      "absolute",
      "inset-0",
      "flex",
      "justify-center",
      "items-center",
      "bg-white",
      "bg-opacity-75",
      "h-full"
    );
  });

  it("renders loading text", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("renders the spinner animation element", () => {
    render(<Spinner />);
    const svg = screen.getByRole("status").querySelector("svg");

    expect(svg).toBeDefined();
    expect(svg).toHaveClass("animate-spin", "text-gray-200", "fill-blue-600");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("maintains accessibility features", () => {
    render(<Spinner />);
    const statusElement = screen.getByRole("status");
    const loadingText = screen.getByText("Loading...");

    expect(statusElement).toBeDefined();
    expect(loadingText).toHaveClass("sr-only");
  });
});
