import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ReportsContainer from "../ReportsContainer";
import { useReportsData } from "../../../../hooks/useReportsData";
import type { ReportCardProps } from "../../../../types/Report";
import { NotificationType } from "../../../../types/common/Notification";

// Mock the custom hooks and child components
vi.mock("../../../../hooks/useReportsData");
vi.mock("../ReportsGrid", () => ({
  default: vi.fn(({ reports }) => (
    <div data-testid="mock-reports-grid">{reports.length} reports</div>
  ))
}));

vi.mock("../../common/Pagination", () => ({
  default: vi.fn(({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between mt-4">
      <button
        className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  ))
}));

vi.mock("../../common/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

describe("ReportsContainer", () => {
  const mockReports: ReportCardProps["report"][] = [
    {
      id: 1,
      title: "Report 1",
      description: "Description 1",
      name: "Pet Name",
      status: "lost",
      species: "dog",
      breed1: "Labrador",
      breed2: null,
      gender: "male",
      color1: "black",
      color2: null,
      color3: null,
      area: "Sydney",
      state: "NSW",
      country: "Australia",
      updatedAt: "2024-01-01T12:00:00Z",
      updatedLastThreeDays: true,
      archivedAt: null,
      createdAt: "2024-01-01T12:00:00Z",
      microchipId: null,
      latitude: -33.865143,
      longitude: 151.2099,
      image: {
        id: "1",
        url: "https://example.com/image1.jpg",
        thumbnailUrl: "https://example.com/thumb1.jpg",
        variantUrl: "https://example.com/variant1.jpg",
        filename: "image1.jpg",
        publicId: "image_123"
      }
    }
  ];

  const mockUseReportsData = {
    reports: mockReports,
    data: {
      pagination: {
        pages: 5
      }
    },
    isLoading: false,
    error: null,
    notification: null,
    setNotification: vi.fn()
  };

  const defaultContainerProps = {
    query: "test",
    filters: {
      species: "",
      color: "",
      gender: "",
      area: "",
      state: "",
      breed: "",
      size: "",
      status: "",
      country: "",
      sort: "newest"
    },
    page: 1,
    onPageChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useReportsData as any).mockReturnValue(mockUseReportsData);
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it("renders correctly", () => {
    const { container } = renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(container).toMatchSnapshot();
  });

  it("displays loading state", () => {
    (useReportsData as any).mockReturnValue({ ...mockUseReportsData, isLoading: true });
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(screen.getByTestId("spinner")).toBeDefined();
  });

  it("displays error state", () => {
    (useReportsData as any).mockReturnValue({
      ...mockUseReportsData,
      error: "Failed to load reports"
    });
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(screen.getByText("An error occurred while loading reports")).toBeDefined();
  });

  it("displays notification when present", () => {
    const notification = {
      type: NotificationType.SUCCESS,
      message: "Success message"
    };
    (useReportsData as any).mockReturnValue({
      ...mockUseReportsData,
      notification
    });
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(screen.getByText("Success message")).toBeDefined();
  });

  it("handles pagination", async () => {
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(defaultContainerProps.onPageChange).toHaveBeenCalledWith(2);
    });
  });

  it("displays correct number of reports", () => {
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(screen.getByText("1 reports")).toBeDefined();
  });

  it("handles notification close", () => {
    const notification = {
      type: NotificationType.SUCCESS,
      message: "Success message"
    };
    (useReportsData as any).mockReturnValue({
      ...mockUseReportsData,
      notification
    });
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockUseReportsData.setNotification).toHaveBeenCalledWith(null);
  });

  it("renders pagination only when pagination data exists", () => {
    (useReportsData as any).mockReturnValue({
      ...mockUseReportsData,
      data: { pagination: null }
    });
    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);

    expect(screen.queryByTestId("mock-pagination")).toBeNull();
  });

  it.each([
    [1, "1 report"],
    [2, "2 reports"],
    [0, "0 reports"]
  ])("displays correct report count for %i reports", (count, expected) => {
    const reportsData = {
      ...mockUseReportsData,
      reports: Array(count).fill(mockReports[0])
    };
    (useReportsData as any).mockReturnValue(reportsData);

    renderWithRouter(<ReportsContainer {...defaultContainerProps} />);
    expect(screen.getByTestId("mock-reports-grid")).toHaveTextContent(expected);
  });
});
