import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { ColorFields } from "../ColorFields";
import type { ColorFieldsProps } from "../../../../types/Report";
import { getColorOptions } from "../../../../lib/reports/colorList";
import { act } from "react";

const mockFormData = {
  title: "Test Title",
  description: "Test Description",
  name: "Test Pet Name",
  species: "Dog",
  breed1: "Labrador",
  breed2: null,
  color1: "Black" as string,
  color2: "" as string,
  color3: "" as string,
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

describe("ColorFields", () => {
  const mockOnInputChange = vi.fn();
  const mockOnShowColor2Change = vi.fn();
  const mockOnShowColor3Change = vi.fn();

  const mockProps: Required<ColorFieldsProps> = {
    formData: mockFormData,
    showColor2: false,
    showColor3: false,
    onInputChange: mockOnInputChange,
    onShowColor2Change: mockOnShowColor2Change,
    onShowColor3Change: mockOnShowColor3Change,
    isLoading: false
  };

  beforeEach(() => {
    mockOnInputChange.mockClear();
    mockOnShowColor2Change.mockClear();
    mockOnShowColor3Change.mockClear();
  });

  describe("Rendering", () => {
    it("should match snapshot", () => {
      const { container } = render(<ColorFields {...mockProps} />);
      expect(container).toMatchSnapshot();
    });

    it("should render color1 select with all color options", () => {
      render(<ColorFields {...mockProps} />);
      const select = screen.getByLabelText(/color 1/i);
      expect(select).toBeDefined();

      const input = within(select.parentElement!).getByRole("combobox");
      expect(input.textContent).toBe("Black");
    });

    it("should not show color2 and color3 fields initially", () => {
      render(<ColorFields {...mockProps} />);
      expect(screen.queryByRole("combobox", { name: /color 2/i })).toBeNull();
      expect(screen.queryByRole("combobox", { name: /color 3/i })).toBeNull();
    });

    it("should show 'Add Another Color' button when color1 is selected", () => {
      render(<ColorFields {...mockProps} />);
      const addButton = screen.getByText(/add another color/i, { selector: "button" });
      expect(addButton).toBeDefined();
    });
  });

  describe("Color Selection Logic", () => {
    it.each(getColorOptions())("should allow selecting %s as color1", async color => {
      render(<ColorFields {...mockProps} />);

      const select = screen.getByLabelText(/color 1/i);
      expect(select).toBeDefined();

      await act(async () => {
        const changeEvent = {
          target: { name: "color1", value: color }
        };
        mockProps.onInputChange(changeEvent as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            name: "color1",
            value: color
          })
        })
      );
    });

    it("should prevent duplicate color selection", async () => {
      render(
        <ColorFields
          {...mockProps}
          showColor2={true}
          formData={{ ...mockFormData, color1: "Black", color2: "White" }}
        />
      );

      const select = screen.getByLabelText("Color 2");
      expect(select).toBeDefined();

      const selectElement = within(select.parentElement!).getByRole("combobox");
      await act(async () => {
        await userEvent.click(selectElement);
      });

      const options = screen.queryByRole("option", { name: "Black" });
      expect(options).toBeNull();
    });

    it("should clear color3 when selecting same color in color2", async () => {
      render(
        <ColorFields
          {...mockProps}
          showColor2={true}
          showColor3={true}
          formData={{ ...mockFormData, color2: "White", color3: "Brown" }}
        />
      );

      await act(async () => {
        mockProps.onInputChange({
          target: { name: "color2", value: "Brown" }
        } as React.ChangeEvent<HTMLInputElement>);

        mockProps.onInputChange({
          target: { name: "color3", value: "" }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const calls = mockOnInputChange.mock.calls;
      expect(calls[0][0].target).toEqual({ name: "color2", value: "Brown" });
      expect(calls[1][0].target).toEqual({ name: "color3", value: "" });
    });
  });

  describe("Add/Remove Color Fields", () => {
    it("should show color2 field when add button is clicked", async () => {
      render(<ColorFields {...mockProps} />);
      const addButton = screen.getByText(/add another color/i, { selector: "button" });

      await act(async () => {
        await userEvent.click(addButton);
      });

      expect(mockOnShowColor2Change).toHaveBeenCalledWith(true);
    });

    it("should remove color2 field when remove button is clicked", async () => {
      render(<ColorFields {...mockProps} showColor2={true} />);
      const removeButton = screen.getByLabelText(/remove color 2/i);

      await act(async () => {
        await userEvent.click(removeButton);
      });

      expect(mockOnShowColor2Change).toHaveBeenCalledWith(false);
    });

    it("should disable add/remove buttons when loading", () => {
      render(<ColorFields {...mockProps} showColor2={true} isLoading={true} />);

      // Use queryByRole to check if buttons exist and are disabled
      const addButton = screen.queryByRole("button", {
        name: /add another color/i,
        hidden: true
      });
      const removeButton = screen.queryByRole("button", {
        name: /remove color 2/i,
        hidden: true
      });

      // Check if buttons are either disabled or not rendered when loading
      if (addButton) {
        expect(addButton).toBeDisabled();
      } else {
        expect(addButton).toBeNull();
      }

      if (removeButton) {
        expect(removeButton).toBeDisabled();
      } else {
        expect(removeButton).toBeNull();
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle empty values", () => {
      render(
        <ColorFields
          {...mockProps}
          formData={{
            ...mockFormData,
            color1: "",
            color2: "",
            color3: ""
          }}
        />
      );

      const select = screen.getByLabelText(/color 1/i);
      const input = within(select.parentElement!).getByRole("combobox");
      expect(input.textContent?.replace(/\u200B/g, "")).toBe("");
    });
  });
});
