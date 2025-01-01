import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import Pagination from "../Pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPagination = (props = {}) => {
    return render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} {...props} />
    );
  };

  describe("Rendering", () => {
    it("renders pagination controls", () => {
      renderPagination();
      expect(screen.getByText("Previous")).toBeDefined();
      expect(screen.getByText("Next")).toBeDefined();
    });

    it("displays current page and total pages", () => {
      renderPagination({ currentPage: 3, totalPages: 5 });
      expect(screen.getByText("Page 3 of 5")).toBeDefined();
    });

    it("disables Previous button on first page", () => {
      renderPagination({ currentPage: 1 });
      const prevButton = screen.getByText("Previous");
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass("bg-gray-300", "cursor-not-allowed");
    });

    it("disables Next button on last page", () => {
      renderPagination({ currentPage: 10, totalPages: 10 });
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass("bg-gray-300", "cursor-not-allowed");
    });

    it("enables both buttons when on middle page", () => {
      renderPagination({ currentPage: 5, totalPages: 10 });
      const prevButton = screen.getByText("Previous");
      const nextButton = screen.getByText("Next");
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      expect(prevButton).toHaveClass("bg-blue-500", "hover:bg-blue-600");
      expect(nextButton).toHaveClass("bg-blue-500", "hover:bg-blue-600");
    });
  });

  describe("Interactions", () => {
    it("calls onPageChange with previous page number when Previous is clicked", async () => {
      renderPagination({ currentPage: 5 });
      const prevButton = screen.getByText("Previous");
      await userEvent.click(prevButton);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange with next page number when Next is clicked", async () => {
      renderPagination({ currentPage: 5 });
      const nextButton = screen.getByText("Next");
      await userEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });

    it("does not trigger click events on disabled Previous button", async () => {
      renderPagination({ currentPage: 1 });
      const prevButton = screen.getByText("Previous");
      await userEvent.click(prevButton);
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it("does not trigger click events on disabled Next button", async () => {
      renderPagination({ currentPage: 10, totalPages: 10 });
      const nextButton = screen.getByText("Next");
      await userEvent.click(nextButton);
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("disables buttons appropriately for screen readers", () => {
      renderPagination({ currentPage: 1 });
      expect(screen.getByText("Previous")).toHaveAttribute("disabled");
      expect(screen.getByText("Next")).not.toHaveAttribute("disabled");
    });
  });

  describe("Snapshots", () => {
    it.each([
      { currentPage: 1, totalPages: 10, desc: "first page" },
      { currentPage: 5, totalPages: 10, desc: "middle page" },
      { currentPage: 10, totalPages: 10, desc: "last page" }
    ])("matches snapshot for $desc", ({ currentPage, totalPages }) => {
      const { container } = renderPagination({ currentPage, totalPages });
      expect(container).toMatchSnapshot();
    });
  });
});
