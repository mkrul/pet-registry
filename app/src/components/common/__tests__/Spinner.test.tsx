import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Spinner from "../Spinner";

describe("Spinner", () => {
  const renderSpinner = (props = {}) => {
    return render(<Spinner {...props} />);
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      renderSpinner();
      const spinner = screen.getByTestId("spinner");
      const svg = screen.getByRole("status").querySelector("svg");

      expect(spinner).toBeDefined();
      expect(spinner).toHaveClass("bg-white", "bg-opacity-75");
      expect(svg).toHaveStyle({ width: "40px", height: "40px" });
      expect(svg).toHaveClass("text-gray-200", "fill-blue-600");
    });

    it("renders with custom color", () => {
      renderSpinner({ color: "text-red-200" });
      const svg = screen.getByRole("status").querySelector("svg");
      expect(svg).toHaveClass("text-red-200");
    });

    it("renders with custom size", () => {
      renderSpinner({ size: 60 });
      const svg = screen.getByRole("status").querySelector("svg");
      expect(svg).toHaveStyle({ width: "60px", height: "60px" });
    });

    it("renders without faded background when bgFaded is false", () => {
      renderSpinner({ bgFaded: false });
      const spinner = screen.getByTestId("spinner");
      expect(spinner).not.toHaveClass("bg-white", "bg-opacity-75");
    });

    it("renders with custom className", () => {
      renderSpinner({ className: "custom-class" });
      const svg = screen.getByRole("status").querySelector("svg");
      expect(svg).toHaveClass("custom-class");
    });

    it("renders inline without wrapper div", () => {
      renderSpinner({ inline: true });
      expect(screen.queryByTestId("spinner")).toBeNull();
      expect(screen.getByRole("status")).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("includes loading text for screen readers", () => {
      renderSpinner();
      expect(screen.getByText("Loading...")).toHaveClass("sr-only");
    });

    it("uses correct ARIA attributes", () => {
      renderSpinner();
      const svg = screen.getByRole("status").querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Snapshots", () => {
    it.each([
      { desc: "default props", props: {} },
      { desc: "custom color", props: { color: "text-red-200" } },
      { desc: "custom size", props: { size: 60 } },
      { desc: "no faded background", props: { bgFaded: false } },
      { desc: "custom class", props: { className: "custom-class" } },
      { desc: "inline mode", props: { inline: true } }
    ])("matches snapshot with $desc", ({ props }) => {
      const { container } = renderSpinner(props);
      expect(container).toMatchSnapshot();
    });
  });
});
