import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SubmitButton } from "../SubmitButton";

describe("SubmitButton", () => {
  const renderSubmitButton = (props = {}) => {
    return render(<SubmitButton isLoading={false} {...props} />);
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      renderSubmitButton();
      const button = screen.getByRole("button");
      expect(button).toBeDefined();
      expect(button).toHaveTextContent("Submit");
      expect(button).toHaveClass("bg-green-600", "hover:bg-green-700");
      expect(button).not.toBeDisabled();
    });

    it("renders with custom text", () => {
      renderSubmitButton({ text: "Save Changes" });
      expect(screen.getByRole("button")).toHaveTextContent("Save Changes");
    });

    it("renders loading state correctly", () => {
      renderSubmitButton({ isLoading: true });
      const button = screen.getByRole("button");

      expect(button).toHaveTextContent("Submitting...");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("bg-gray-400", "cursor-not-allowed");
      expect(button).not.toHaveClass("bg-green-600", "hover:bg-green-700");

      // Check if spinner is present
      const spinner = screen.getByRole("status");
      expect(spinner).toBeDefined();
      expect(spinner.querySelector("svg")).toHaveClass("text-white");
    });

    it("renders with custom loading text", () => {
      renderSubmitButton({ isLoading: true, loadingText: "Saving..." });
      expect(screen.getByRole("button")).toHaveTextContent("Saving...");
    });
  });

  describe("Accessibility", () => {
    it("has correct button type", () => {
      renderSubmitButton();
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("communicates loading state to screen readers", () => {
      renderSubmitButton({ isLoading: true });
      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("sr-only");
    });

    it("is properly disabled when loading", () => {
      renderSubmitButton({ isLoading: true });
      expect(screen.getByRole("button")).toHaveAttribute("disabled");
    });
  });

  describe("Styling", () => {
    it("has correct base classes", () => {
      renderSubmitButton();
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "w-fit",
        "inline-flex",
        "items-center",
        "px-4",
        "py-2",
        "border",
        "border-transparent",
        "text-sm",
        "font-medium",
        "rounded-md",
        "shadow-sm",
        "text-white"
      );
    });

    it("applies spinner styles correctly", () => {
      renderSubmitButton({ isLoading: true });
      const spinner = screen.getByRole("status").querySelector("svg");
      expect(spinner).toHaveClass("ml-2");
      expect(spinner).toHaveStyle({ width: "16px", height: "16px" });
    });
  });

  describe("Snapshots", () => {
    it.each([
      { desc: "default state", props: {} },
      { desc: "loading state", props: { isLoading: true } },
      { desc: "custom text", props: { text: "Save Changes" } },
      { desc: "custom loading text", props: { isLoading: true, loadingText: "Saving..." } }
    ])("matches snapshot with $desc", ({ props }) => {
      const { container } = renderSubmitButton(props);
      expect(container).toMatchSnapshot();
    });
  });
});
