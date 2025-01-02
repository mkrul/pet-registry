import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ReportsGrid from "../ReportsGrid";
import ReportCard from "../ReportCard";
import type { ReportCardProps } from "../../../../types/Report";

// Mock ReportCard component with more complete props
vi.mock("../ReportCard", () => ({
  default: vi.fn(({ report, currentPage, currentQuery }) => (
    <div data-testid="mock-report-card" data-page={currentPage} data-query={currentQuery}>
      <h2>{report.title}</h2>
      <p>{report.description}</p>
    </div>
  ))
}));

describe("ReportsGrid", () => {
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
      image: {
        id: "1",
        url: "https://example.com/image1.jpg",
        thumbnailUrl: "https://example.com/thumb1.jpg",
        variantUrl: "https://example.com/variant1.jpg",
        filename: "image1.jpg",
        publicId: "image_123"
      },
      archivedAt: null,
      createdAt: "2024-01-01T12:00:00Z",
      microchipId: null,
      latitude: -33.865143,
      longitude: 151.2099
    },
    {
      id: 2,
      title: "Report 2",
      description: "Description 2",
      name: "Pet Name 2",
      status: "lost",
      species: "cat",
      breed1: "Persian",
      breed2: null,
      gender: "female",
      color1: "white",
      color2: null,
      color3: null,
      area: "Melbourne",
      state: "VIC",
      country: "Australia",
      updatedAt: "2024-01-02T12:00:00Z",
      updatedLastThreeDays: false,
      image: {
        id: "2",
        url: "https://example.com/image2.jpg",
        thumbnailUrl: "https://example.com/thumb2.jpg",
        variantUrl: "https://example.com/variant2.jpg",
        filename: "image2.jpg",
        publicId: "image_124"
      },
      archivedAt: null,
      createdAt: "2024-01-02T12:00:00Z",
      microchipId: null,
      latitude: -37.813629,
      longitude: 144.963058
    }
  ];

  const defaultProps = {
    reports: mockReports,
    currentPage: 1,
    currentQuery: "test-query"
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderWithRouter(<ReportsGrid {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correct number of report cards", () => {
    renderWithRouter(<ReportsGrid {...defaultProps} />);
    const reportCards = screen.getAllByTestId("mock-report-card");
    expect(reportCards).toHaveLength(mockReports.length);
  });

  it("renders empty grid when no reports provided", () => {
    renderWithRouter(<ReportsGrid {...defaultProps} reports={[]} />);
    const reportCards = screen.queryAllByTestId("mock-report-card");
    expect(reportCards).toHaveLength(0);
  });

  it("passes correct props to ReportCard components", () => {
    renderWithRouter(<ReportsGrid {...defaultProps} />);

    const reportCards = screen.getAllByTestId("mock-report-card");
    reportCards.forEach((card, index) => {
      expect(card).toHaveAttribute("data-page", defaultProps.currentPage.toString());
      expect(card).toHaveAttribute("data-query", defaultProps.currentQuery);
      expect(card.querySelector("h2")).toHaveTextContent(mockReports[index].title);
      expect(card.querySelector("p")).toHaveTextContent(mockReports[index].description);
    });
  });

  it("maintains grid layout classes", () => {
    const { container } = renderWithRouter(<ReportsGrid {...defaultProps} />);
    const grid = container.firstChild;
    expect(grid).toHaveClass("grid", "grid-cols-1", "lg:grid-cols-2", "3xl:grid-cols-3", "gap-4");
  });

  it("verifies ReportCard component is called with correct props", () => {
    renderWithRouter(<ReportsGrid {...defaultProps} />);

    mockReports.forEach((report, index) => {
      expect(ReportCard).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          report,
          currentPage: defaultProps.currentPage,
          currentQuery: defaultProps.currentQuery
        }),
        expect.anything()
      );
    });
  });
});
