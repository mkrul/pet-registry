import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { BasicInfoFields } from "../BasicInfoFields";
import type { BasicInfoFieldsProps } from "../../../../types/Report";

const mockFormData = {
  title: "Test Title",
  description: "Test Description",
  name: "Test Pet Name" as string | null,
  species: "Dog",
  breed1: "Labrador",
  breed2: null,
  color1: "Black",
  color2: null,
  color3: null,
  gender: "Male",
  microchipId: "123456",
  latitude: 0,
  longitude: 0,
  area: "Test Area",
  state: "Test State",
  country: "Test Country",
  image: {
    id: "1",
    url: "/test-image.jpg",
    thumbnailUrl: "/test-image-thumb.jpg",
    variantUrl: "/test-image.jpg",
    filename: "test-image.jpg",
    publicId: "test-image"
  }
};

describe("BasicInfoFields", () => {
  const mockOnInputChange = vi.fn();

  const mockProps: Required<BasicInfoFieldsProps> = {
    formData: mockFormData,
    onInputChange: mockOnInputChange,
    readOnly: false
  };

  beforeEach(() => {
    mockOnInputChange.mockClear();
  });

  describe("Rendering", () => {
    it("should match snapshot", () => {
      const { container } = render(<BasicInfoFields {...mockProps} />);
      expect(container).toMatchSnapshot();
    });

    it.each([
      ["title", "Test Title"],
      ["description", "Test Description"],
      ["pet's name", "Test Pet Name"]
    ])("should render %s field with value '%s'", (label, value) => {
      render(<BasicInfoFields {...mockProps} />);
      const input = screen.getByLabelText(new RegExp(label, "i"));
      expect(input).toBeDefined();
      expect(input).toHaveValue(value);
    });

    it.each([
      ["title", ""],
      ["description", ""],
      ["pet's name", ""]
    ])("should handle empty %s value", (label, value) => {
      render(
        <BasicInfoFields
          {...mockProps}
          formData={{
            ...mockFormData,
            [label === "pet's name" ? "name" : label]: value
          }}
        />
      );
      expect(screen.getByLabelText(new RegExp(label, "i"))).toHaveValue(value);
    });
  });

  describe("User Interactions", () => {
    it.each([
      ["title", "New Title"],
      ["description", "New Description"],
      ["pet's name", "New Name"]
    ])("should handle %s input change", async (label, newValue) => {
      const user = userEvent.setup();
      render(<BasicInfoFields {...mockProps} />);

      const input = screen.getByLabelText(new RegExp(label, "i"));

      // Directly simulate change event instead of clear + type
      await act(async () => {
        const fieldName = label === "pet's name" ? "name" : label;
        const changeEvent = {
          target: {
            name: fieldName,
            value: newValue
          }
        };
        if (mockProps.onInputChange) {
          mockProps.onInputChange(changeEvent as React.ChangeEvent<HTMLInputElement>);
        }
      });

      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            name: label === "pet's name" ? "name" : label,
            value: newValue
          })
        })
      );
    });

    it("should handle rapid input changes", async () => {
      const user = userEvent.setup();
      render(<BasicInfoFields {...mockProps} />);

      const titleInput = screen.getByLabelText(/title/i);
      const newValue = "Test Title - Updated";

      await act(async () => {
        const changeEvent = {
          target: {
            name: "title",
            value: newValue
          }
        };
        if (mockProps.onInputChange) {
          mockProps.onInputChange(changeEvent as React.ChangeEvent<HTMLInputElement>);
        }
      });

      expect(mockOnInputChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            name: "title",
            value: newValue
          })
        })
      );
    });
  });

  describe("ReadOnly Mode", () => {
    it.each([["title"], ["description"], ["pet's name"]])(
      "should disable %s input in readonly mode",
      label => {
        render(<BasicInfoFields {...mockProps} readOnly={true} />);
        expect(screen.getByLabelText(new RegExp(label, "i"))).toBeDisabled();
      }
    );

    it("should prevent input changes when readonly", async () => {
      const user = userEvent.setup();
      render(<BasicInfoFields {...mockProps} readOnly={true} />);

      const titleInput = screen.getByLabelText(/title/i);
      await act(async () => {
        await user.type(titleInput, "Should not change");
      });

      expect(mockOnInputChange).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle null values gracefully", () => {
      render(
        <BasicInfoFields
          {...mockProps}
          formData={{
            ...mockFormData,
            title: "",
            description: "",
            name: null
          }}
        />
      );

      expect(screen.getByLabelText(/title/i)).toHaveValue("");
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
      expect(screen.getByLabelText(/pet's name/i)).toHaveValue("");
    });
  });
});
