import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ReportCard from "../ReportCard";
import { ReportCardProps } from "../../../../types/Report";
import Spinner from "../../../common/Spinner";

// Mock Spinner component
vi.mock("../../../common/Spinner", () => ({
  default: () => <div data-testid="spinner" role="status" />
}));

// Mock LocationDisplay component
vi.mock("../../../common/LocationDisplay", () => ({
  default: vi.fn(({ area, state, country }) => (
    <div data-testid="mock-location-display">{`${area}, ${state}, ${country}`}</div>
  ))
}));

describe("ReportCard", () => {
  const mockReport: Partial<ReportCardProps["report"]> = {
    id: 1,
    title: "Test Report",
    description: "Test description for the report",
    area: "Sydney",
    state: "NSW",
    country: "Australia",
    updatedAt: "2024-01-01T12:00:00Z",
    updatedLastThreeDays: true,
    image: {
      id: "1",
      url: "https://example.com/image.jpg",
      thumbnailUrl: "https://example.com/image.jpg",
      variantUrl: "https://example.com/image.jpg",
      filename: "image.jpg",
      publicId: "image_123"
    }
  };

  const defaultProps = {
    report: mockReport as ReportCardProps["report"],
    currentPage: 1,
    currentQuery: "test"
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders correctly", () => {
    const { container } = renderWithRouter(<ReportCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("displays truncated title when title is long", () => {
    const longTitleReport = {
      ...mockReport,
      title: "This is a very long title that should be truncated"
    };
    renderWithRouter(
      <ReportCard {...defaultProps} report={longTitleReport as ReportCardProps["report"]} />
    );

    const title = screen.getByText("This is a very long title...");
    expect(title).toBeDefined();
  });

  it("displays full title when title is short", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const title = screen.getByText("Test Report");
    expect(title).toBeDefined();
  });

  it("displays truncated description when description is long", () => {
    const longDescReport = {
      ...mockReport,
      description: "A".repeat(200)
    };
    renderWithRouter(
      <ReportCard {...defaultProps} report={longDescReport as ReportCardProps["report"]} />
    );

    const description = screen.getByText("A".repeat(160) + "...");
    expect(description).toBeDefined();
  });

  it("displays location information", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const location = screen.getByTestId("mock-location-display");
    expect(location).toBeDefined();
    expect(location).toHaveTextContent("Sydney, NSW, Australia");
  });

  it("shows loading spinner while image is loading", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeDefined();
  });

  it("handles image load success", async () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const image = screen.getByAltText("Test Report") as HTMLImageElement;
    await fireEvent.load(image);

    expect(screen.queryByTestId("spinner")).toBeNull();
    expect(image.className).toContain("block");
  });

  it("handles image load error", async () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const image = screen.getByAltText("Test Report") as HTMLImageElement;
    await fireEvent.error(image);

    expect(image.src).toContain("/images/placeholder.png");
  });

  it("displays updated badge for recently updated reports", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const updatedBadge = screen.getByText("UPDATED");
    expect(updatedBadge).toBeDefined();
  });

  it("does not display updated badge for older reports", () => {
    const oldReport = {
      ...mockReport,
      updatedLastThreeDays: false
    };
    renderWithRouter(
      <ReportCard {...defaultProps} report={oldReport as ReportCardProps["report"]} />
    );
    const updatedBadge = screen.queryByText("UPDATED");
    expect(updatedBadge).toBeNull();
  });

  it("generates correct link with query parameters", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/reports/1?query=${encodeURIComponent("test")}&page=1`);
  });

  it("applies green ring styling for recently updated reports", () => {
    renderWithRouter(<ReportCard {...defaultProps} />);
    const imageContainer = screen.getByAltText("Test Report").parentElement;
    expect(imageContainer).toHaveClass("ring-4", "ring-green-500");
  });
});
