import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import Notification from "../Notification";
import { NotificationType } from "../../../types/common/Notification";

describe("Notification", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNotification = (props = {}) => {
    return render(
      <Notification
        type={NotificationType.INFO}
        message="Test message"
        onClose={mockOnClose}
        {...props}
      />
    );
  };

  describe("Rendering", () => {
    it.each([
      {
        type: NotificationType.SUCCESS,
        className: "bg-green-100 border-green-400 text-green-700"
      },
      {
        type: NotificationType.WARNING,
        className: "bg-yellow-100 border-yellow-400 text-yellow-700"
      },
      {
        type: NotificationType.ERROR,
        className: "bg-red-100 border-red-400 text-red-700"
      },
      {
        type: NotificationType.INFO,
        className: "bg-blue-100 border-blue-400 text-blue-700"
      }
    ])("renders $type notification with correct styles", ({ type, className }) => {
      renderNotification({ type });
      const alert = screen.getByRole("alert");
      expect(alert).toBeDefined();
      expect(alert).toHaveClass(className);
    });

    it("displays custom message when provided", () => {
      const message = "Custom notification message";
      renderNotification({ message });
      expect(screen.getByText(message)).toBeDefined();
    });

    it("displays default message when no message provided", () => {
      renderNotification({
        message: "",
        type: NotificationType.SUCCESS
      });
      expect(screen.getByText("The operation has completed successfully.")).toBeDefined();
    });

    it("displays default error message for error type without message", () => {
      renderNotification({
        message: "",
        type: NotificationType.ERROR
      });
      expect(screen.getByText("An unexpected error has occurred.")).toBeDefined();
    });

    it("renders close button with correct accessibility attributes", () => {
      renderNotification();
      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeDefined();
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });
  });

  describe("Interactions", () => {
    it("calls onClose when close button is clicked", async () => {
      renderNotification();
      const closeButton = screen.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("uses correct ARIA role", () => {
      renderNotification();
      expect(screen.getByRole("alert")).toBeDefined();
    });

    it("hides times symbol from screen readers", () => {
      renderNotification();
      const timesSymbol = screen.getByText("×");
      expect(timesSymbol).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Snapshots", () => {
    it.each(Object.values(NotificationType))("matches snapshot for %s notification", type => {
      const { container } = renderNotification({ type });
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with custom message", () => {
      const { container } = renderNotification({
        message: "Custom test message"
      });
      expect(container).toMatchSnapshot();
    });
  });
});
