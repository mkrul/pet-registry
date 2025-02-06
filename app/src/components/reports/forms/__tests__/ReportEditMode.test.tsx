import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import EditReportForm from "../EditReportForm";
import { EditReportFormProps } from "../../../../types/Report";
import { ImageProps } from "../../../../types/common/Image";

vi.mock("../../../common/Map", () => ({
  default: () => <div data-testid="map">Map Component</div>
}));

vi.mock("../../../common/Spinner", () => ({
  default: ({ inline }: { inline?: boolean }) => (
    <div data-testid={inline ? "inline-spinner" : "spinner"}>Loading...</div>
  )
}));

vi.mock("../../../common/BreedSearch", () => ({
  default: ({ onChange, value }: { onChange: (value: string) => void; value: string }) => (
    <input data-testid="breed-search" value={value} onChange={e => onChange(e.target.value)} />
  )
}));

vi.mock("../../../lib/formatDate", () => ({
  default: () => "01/01/2023"
}));

const mockGetFilteredColorOptions = vi.fn().mockImplementation(selectedColors => {
  const allColors = ["Black", "White", "Brown"];
  return allColors.filter(color => !selectedColors.includes(color));
});

const mockProps: EditReportFormProps = {
  formData: {
    title: "Test Report",
    description: "Test Description",
    image: { variantUrl: "/test-image.jpg" } as ImageProps,
    species: "Dog",
    breed1: "Labrador",
    breed2: null,
    color1: "Black",
    color2: null,
    color3: null,
    gender: "Male",
    name: "Max",
    microchipId: "123456",
    latitude: 0,
    longitude: 0,
    area: "Test Area",
    state: "Test State",
    country: "Test Country",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  handleInputChange: vi.fn(),
  handleFileChange: vi.fn(),
  handleSaveChanges: vi.fn(e => e.preventDefault()),
  handleCancelChanges: vi.fn(),
  isSaving: false,
  imageSrc: "/test-image.jpg",
  handleImageLoad: vi.fn(),
  handleImageError: vi.fn(),
  showBreed2: false,
  showColor2: false,
  showColor3: false,
  addBreed: vi.fn(),
  removeBreed: vi.fn(),
  addColor: vi.fn(),
  removeColor: vi.fn(),
  handleLocationSelect: vi.fn(),
  speciesOptions: ["Dog", "Cat"],
  breedOptions: ["Labrador", "Golden Retriever"],
  colorOptions: ["Black", "White", "Brown"],
  genderOptions: ["Male", "Female", "Unknown"],
  getFilteredBreedOptions: vi.fn().mockReturnValue(["Golden Retriever"]),
  getFilteredColorOptions: mockGetFilteredColorOptions,
  VIEW_ZOOM_LEVEL: 15
};

describe("EditReportForm", () => {
  describe("Form Fields", () => {
    it("renders form with initial values", () => {
      render(<EditReportForm {...mockProps} />);

      expect(screen.getByDisplayValue("Test Report")).toBeDefined();
      expect(screen.getByDisplayValue("Test Description")).toBeDefined();
      expect(screen.getByDisplayValue("Max")).toBeDefined();
      expect(screen.getByDisplayValue("123456")).toBeDefined();

      expect(screen.getByText("Dog")).toBeDefined();
      expect(screen.getByText("Male")).toBeDefined();
      expect(screen.getByText("Black")).toBeDefined();

      expect(screen.getByTestId("breed-search")).toBeDefined();

      expect(screen.getByText("Test Area, Test State, Test Country")).toBeDefined();
      expect(screen.getByTestId("map")).toBeDefined();
    });

    it("renders image section correctly", () => {
      render(<EditReportForm {...mockProps} />);

      const uploadButton = screen.getByText(/choose file/i);
      const image = screen.getByRole("img");

      expect(uploadButton).toBeDefined();
      expect(image).toBeDefined();
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });
  });

  describe("Form Actions", () => {
    it("handles save action", () => {
      render(<EditReportForm {...mockProps} />);

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      expect(mockProps.handleSaveChanges).toHaveBeenCalled();
    });

    it("shows spinner during save", () => {
      render(<EditReportForm {...mockProps} isSaving={true} />);

      expect(screen.getByTestId("inline-spinner")).toBeDefined();
      expect(screen.getByText(/saving/i)).toBeDefined();
    });

    it("handles cancel action", () => {
      render(<EditReportForm {...mockProps} />);

      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);

      expect(mockProps.handleCancelChanges).toHaveBeenCalled();
    });
  });

  describe("Dynamic Fields", () => {
    it("handles breed fields correctly", () => {
      const { rerender } = render(<EditReportForm {...mockProps} />);

      expect(screen.getByText(/add another breed/i)).toBeDefined();

      rerender(<EditReportForm {...mockProps} showBreed2={true} />);
      expect(screen.getByLabelText(/remove breed/i)).toBeDefined();
    });

    it("handles color fields correctly", () => {
      const { rerender } = render(<EditReportForm {...mockProps} />);

      const addColorButton = screen.getByText(/add another color/i);
      fireEvent.click(addColorButton);
      expect(mockProps.addColor).toHaveBeenCalled();

      rerender(<EditReportForm {...mockProps} showColor2={true} showColor3={true} />);
      expect(screen.queryByText(/add another color/i)).toBeNull();
      expect(mockGetFilteredColorOptions).toHaveBeenCalled();
    });
  });
});
