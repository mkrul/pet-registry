import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ViewReportForm from "../ViewReportForm";
import { ViewReportFormProps } from "../../../../types/Report";
import { ImageProps } from "../../../../types/common/Image";

vi.mock("../../../common/Map", () => ({
  default: () => <div data-testid="map">Map Component</div>
}));

vi.mock("../../../common/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock("../../../lib/formatDate", () => ({
  default: () => "12/31/2022, 7:00 PM"
}));

const mockReport = {
  id: 1,
  title: "Test Report",
  description: "Test Description",
  image: { variantUrl: "/test-image.jpg" } as ImageProps,
  species: "Dog",
  breed1: "Labrador",
  breed2: "Golden Retriever",
  color1: "Black",
  color2: "Brown",
  color3: "White",
  gender: "Male",
  name: "Max",
  microchipId: "123456",
  latitude: 0,
  longitude: 0,
  area: "Test Area",
  state: "Test State",
  country: "Test Country",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
  status: "active",
  archivedAt: null,
  recentlyUpdated: false,
  recentlyCreated: false
};

const mockProps: ViewReportFormProps = {
  report: mockReport,
  onEditClick: vi.fn(),
  onBackClick: vi.fn(),
  imageSrc: "/test-image.jpg",
  handleImageLoad: vi.fn(),
  handleImageError: vi.fn()
};

describe("ViewReportForm", () => {
  describe("Content Display", () => {
    it("renders basic report information", () => {
      const { container } = render(<ViewReportForm {...mockProps} />);

      expect(screen.getByText("Test Report")).toBeDefined();
      expect(screen.getByText("Test Description")).toBeDefined();
      expect(screen.getByText("Max")).toBeDefined();
      expect(screen.getByText("123456")).toBeDefined();
      expect(container).toMatchSnapshot();
    });

    it("renders pet details correctly", () => {
      render(<ViewReportForm {...mockProps} />);

      expect(screen.getByText("Dog")).toBeDefined();
      expect(screen.getByText("Labrador")).toBeDefined();
      expect(screen.getByText("Golden Retriever")).toBeDefined();
      expect(screen.getByText("Male")).toBeDefined();
    });

    it("renders all colors", () => {
      render(<ViewReportForm {...mockProps} />);

      expect(screen.getByText("Black")).toBeDefined();
      expect(screen.getByText("Brown")).toBeDefined();
      expect(screen.getByText("White")).toBeDefined();
    });

    it("renders location information", () => {
      render(<ViewReportForm {...mockProps} />);

      expect(screen.getByText("Test Area, Test State, Test Country")).toBeDefined();
      expect(screen.getByTestId("map")).toBeDefined();
    });

    it("renders dates correctly", () => {
      render(<ViewReportForm {...mockProps} />);

      const dates = screen.getAllByText("12/31/2022, 7:00 PM");
      expect(dates).toHaveLength(2);

      const postedAtLabel = screen.getByText("Posted at:");
      const updatedAtLabel = screen.getByText("Updated at:");

      expect(postedAtLabel).toBeDefined();
      expect(updatedAtLabel).toBeDefined();
      expect(postedAtLabel.nextElementSibling?.textContent).toBe("12/31/2022, 7:00 PM");
      expect(updatedAtLabel.nextElementSibling?.textContent).toBe("12/31/2022, 7:00 PM");
    });
  });

  describe("Image Handling", () => {
    it("renders image with loading state", () => {
      render(<ViewReportForm {...mockProps} />);

      const image = screen.getByRole("img");
      expect(image).toBeDefined();
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(screen.getByTestId("spinner")).toBeDefined();
    });

    it("handles image load event", () => {
      render(<ViewReportForm {...mockProps} />);

      const image = screen.getByRole("img");
      fireEvent.load(image);

      expect(mockProps.handleImageLoad).toHaveBeenCalled();
      expect(screen.queryByTestId("spinner")).toBeNull();
    });

    it("handles image error event", () => {
      render(<ViewReportForm {...mockProps} />);

      const image = screen.getByRole("img");
      fireEvent.error(image);

      expect(mockProps.handleImageError).toHaveBeenCalled();
    });
  });

  describe("Button Actions", () => {
    it("handles edit button click", () => {
      render(<ViewReportForm {...mockProps} />);

      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      expect(mockProps.onEditClick).toHaveBeenCalled();
    });

    it("handles back button click", () => {
      render(<ViewReportForm {...mockProps} />);

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockProps.onBackClick).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing optional fields", () => {
      const partialReport = {
        ...mockReport,
        breed2: null,
        color2: null,
        color3: null,
        microchipId: null
      };

      render(<ViewReportForm {...mockProps} report={partialReport} />);

      expect(screen.getByText("Unknown")).toBeDefined();
      expect(screen.queryByText("Golden Retriever")).toBeNull();
    });
  });
});
