import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ErrorBoundary from "../common/ErrorBoundary";

// Mock Notification component
vi.mock("../shared/Notification", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div role="alert">
      <button onClick={() => onClose()} aria-label="close">
        Close
      </button>
    </div>
  )
}));

// Mock console.error to avoid test output noise
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("renders error notification when there is an error", () => {
    const ThrowError = () => {
      throw new Error("Test error message");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("logs error information when error occurs", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    const TestError = new Error("Test error message");
    const ThrowError = () => {
      throw TestError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "ErrorBoundary caught an error:",
      TestError,
      expect.any(Object)
    );
  });

  it("resets error state when notification is closed", async () => {
    const ThrowError = () => {
      throw new Error("Test error message");
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Verify error is shown
    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();

    // Click close button and trigger state update
    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      rerender(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );
    });

    // Verify error notification is removed
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("handles errors without messages", () => {
    const ThrowError = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeDefined();
  });
});
