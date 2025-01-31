import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import BreedSearch from "../BreedSearch";
import { getBreedsBySpecies } from "../../../lib/reports/breedList";

vi.mock("../../../lib/reports/breedList", () => ({
  getBreedsBySpecies: vi.fn()
}));

describe("BreedSearch", () => {
  const mockOnChange = vi.fn();
  const mockBreeds = ["Labrador", "German Shepherd", "Golden Retriever"];

  beforeEach(() => {
    vi.clearAllMocks();
    (getBreedsBySpecies as unknown as MockInstance<typeof getBreedsBySpecies>).mockReturnValue(
      mockBreeds
    );
  });

  it("renders breed search input correctly", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} />);
    });

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByLabelText("Breed")).toBeDefined();
  });

  it("displays breeds based on selected species", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} />);
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      await userEvent.click(input);
    });

    mockBreeds.forEach(breed => {
      expect(screen.getByText(breed)).toBeDefined();
    });
  });

  it("excludes specified breeds from options", async () => {
    await act(async () => {
      render(
        <BreedSearch species="dog" value="" onChange={mockOnChange} excludeBreeds={["Labrador"]} />
      );
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      await userEvent.click(input);
    });

    expect(screen.queryByText("Labrador")).toBeNull();
    expect(screen.getByText("German Shepherd")).toBeDefined();
  });

  it("handles breed selection", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} />);
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      await userEvent.click(input);
    });

    const listbox = await screen.findByRole("listbox");
    const option = await screen.findByRole("option", { name: "Labrador" });
    await userEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("Labrador");
  });

  it("disables input when no species is provided", async () => {
    await act(async () => {
      render(<BreedSearch species="" value="" onChange={mockOnChange} />);
    });

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("disabled");
  });

  it("applies required attribute when specified", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} required />);
    });

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("required");
  });

  it("hides label when hideLabel is true", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} hideLabel />);
    });

    expect(screen.queryByLabelText("Breed")).toBeNull();
  });

  it("applies correct size styling", async () => {
    await act(async () => {
      render(<BreedSearch species="dog" value="" onChange={mockOnChange} size="medium" />);
    });

    const input = screen.getByRole("combobox");
    const inputContainer = input.closest(".MuiInputBase-root");
    expect(inputContainer).toHaveStyle({ height: "56px" });
  });

  it("prevents clearing when disableClearable is true", async () => {
    await act(async () => {
      render(
        <BreedSearch species="dog" value="Labrador" onChange={mockOnChange} disableClearable />
      );
    });

    const clearButton = screen.queryByTitle("Clear");
    expect(clearButton).toBeNull();
  });

  it("updates options when species changes", async () => {
    const { rerender } = render(<BreedSearch species="dog" value="" onChange={mockOnChange} />);

    (getBreedsBySpecies as unknown as MockInstance<typeof getBreedsBySpecies>).mockReturnValue([
      "Siamese",
      "Persian"
    ]);

    await act(async () => {
      rerender(<BreedSearch species="cat" value="" onChange={mockOnChange} />);
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.mouseDown(input);
    });

    expect(screen.getByText("Siamese")).toBeDefined();
    expect(screen.getByText("Persian")).toBeDefined();
  });
});
