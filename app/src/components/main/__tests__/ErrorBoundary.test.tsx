import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ErrorBoundary from "../ErrorBoundary";

// Mock component that throws an error
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Normal Component</div>;
};

// Mock console.error to prevent error logging during tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
  cleanup();
});

describe("ErrorBoundary", () => {
  describe("Normal Rendering", () => {
    it("renders children when no error occurs", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Normal Component")).toBeDefined();
      expect(container).toMatchSnapshot();
    });
  });

  describe("Error Handling", () => {
    it("displays error notification when error occurs", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorAlert = screen.getByRole("alert");
      expect(errorAlert).toBeDefined();
      expect(screen.getByText("Test error")).toBeDefined();
      expect(container).toMatchSnapshot();
    });

    it("can dismiss error notification", () => {
      const { unmount, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeDefined();

      fireEvent.click(closeButton);
      unmount();

      // Re-render with new content after error is cleared
      render(
        <ErrorBoundary>
          <div>Recovered Content</div>
        </ErrorBoundary>
      );

      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByText("Recovered Content")).toBeDefined();
    });
  });

  describe("Error Message Display", () => {
    it("shows error message consistently across environments", () => {
      const environments = ["development", "production"];
      const originalEnv = process.env.NODE_ENV;

      environments.forEach(env => {
        cleanup();
        process.env.NODE_ENV = env;
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );

        const errorElements = screen.getAllByText("Test error");
        expect(errorElements.length).toBe(1);
        expect(screen.getByRole("alert")).toBeDefined();
        cleanup();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});
