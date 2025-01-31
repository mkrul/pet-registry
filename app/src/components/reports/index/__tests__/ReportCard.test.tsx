import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import ReportCard from "../ReportCard";
import { ReportProps } from "../../../../types/Report";

const mockReport: ReportProps = {
  id: 1,
  title: "Test Report",
  description: "Test Description",
  status: "active",
  species: "Dog",
  breed1: "Labrador",
  breed2: null,
  color1: "Black",
  color2: null,
  color3: null,
  gender: "Male",
  name: "Max",
  microchipId: "123456",
  area: "Test Area",
  state: "Test State",
  country: "Test Country",
  latitude: 0,
  longitude: 0,
  archivedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  image: {
    id: "1",
    url: "/test-image.jpg",
    thumbnailUrl: "/test-thumbnail.jpg",
    variantUrl: "/test-variant.jpg",
    filename: "test.jpg",
    publicId: "test"
  },
  recentlyUpdated: false,
  recentlyCreated: false
};

const renderReportCard = (report = mockReport) => {
  return render(
    <BrowserRouter>
      <ReportCard report={report} currentPage={1} currentQuery="" />
    </BrowserRouter>
  );
};

describe("ReportCard", () => {
  describe("Status Indicators", () => {
    it("shows NEW indicator for reports created within 24 hours", () => {
      const newReport = {
        ...mockReport,
        recentlyCreated: true,
        recentlyUpdated: false
      };

      renderReportCard(newReport);
      expect(screen.getByText("NEW")).toBeInTheDocument();
      expect(screen.queryByText("UPDATED")).not.toBeInTheDocument();
    });

    it("shows UPDATED indicator for reports updated within 3 days", () => {
      const updatedReport = {
        ...mockReport,
        recentlyCreated: false,
        recentlyUpdated: true
      };

      renderReportCard(updatedReport);
      expect(screen.queryByText("NEW")).not.toBeInTheDocument();
      expect(screen.getByText("UPDATED")).toBeInTheDocument();
    });

    it("shows no indicator for older reports", () => {
      const oldReport = {
        ...mockReport,
        recentlyCreated: false,
        recentlyUpdated: false
      };

      renderReportCard(oldReport);
      expect(screen.queryByText("NEW")).not.toBeInTheDocument();
      expect(screen.queryByText("UPDATED")).not.toBeInTheDocument();
    });
  });
});
