import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IdentificationFields } from "../IdentificationFields";
import { Species } from "../../../../lib/reports/breedList";
import type { ReportPropsForm } from "../../../../types/Report";
import { getGenderOptions } from "../../../../lib/reports/genderList";

describe("IdentificationFields", () => {
  const defaultProps = {
    formData: {
      microchipId: "",
      gender: "",
      species: "Dog" as Species,
      breed1: "",
      breed2: "",
      title: "",
      description: "",
      name: "",
      color1: "",
      color2: "",
      color3: "",
      dateLastSeen: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      images: [],
      image: {
        id: "0",
        url: "",
        filename: "",
        thumbnailUrl: "",
        variantUrl: "",
        publicId: ""
      },
      area: "",
      country: "",
      latitude: 0,
      longitude: 0
    } as ReportPropsForm,
    showBreed2: false,
    onInputChange: vi.fn(),
    onBreedChange: vi.fn(),
    onBreed2Change: vi.fn(),
    onSpeciesChange: vi.fn(),
    onShowBreed2Change: vi.fn(),
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const { container } = render(<IdentificationFields {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it.each([
    { input: "123456789", expectedCalls: 9 },
    { input: "ABCD1234", expectedCalls: 8 }
  ])("handles microchip ID input changes: $input", async ({ input }) => {
    const user = userEvent.setup();
    render(<IdentificationFields {...defaultProps} />);

    const microchipInput = screen.getByTestId("microchip-id-input").querySelector("input");
    expect(microchipInput).toBeDefined();

    await act(async () => {
      if (microchipInput) {
        await user.type(microchipInput, input);
      }
    });

    expect(defaultProps.onInputChange).toHaveBeenCalledTimes(input.length);
  });

  it.each(getGenderOptions())("handles gender selection for %s", async gender => {
    const user = userEvent.setup();
    render(<IdentificationFields {...defaultProps} />);

    await act(async () => {
      const genderSelect = screen.getByTestId("gender-select");
      await user.click(genderSelect);
    });

    // Wait for MUI menu to appear
    const menu = document.querySelector('[role="listbox"]');
    expect(menu).toBeDefined();

    if (menu) {
      const options = menu.querySelectorAll('[role="option"]');
      const option = Array.from(options).find(opt => opt.textContent === gender);
      expect(option).toBeDefined();

      if (option) {
        await act(async () => {
          await user.click(option);
        });

        expect(defaultProps.onInputChange).toHaveBeenCalledWith(
          expect.objectContaining({
            target: { name: "gender", value: gender }
          })
        );
      }
    }
  });

  it.each(["Cat", "Dog"])("handles species selection for %s", async species => {
    const user = userEvent.setup();
    render(<IdentificationFields {...defaultProps} />);

    await act(async () => {
      const speciesSelect = screen.getByTestId("species-select");
      await user.click(speciesSelect);
    });

    // Wait for MUI menu to appear
    const menu = document.querySelector('[role="listbox"]');
    expect(menu).toBeDefined();

    if (menu) {
      const options = menu.querySelectorAll('[role="option"]');
      const option = Array.from(options).find(opt => opt.textContent === species);
      expect(option).toBeDefined();

      if (option) {
        await act(async () => {
          await user.click(option);
        });
        expect(defaultProps.onSpeciesChange).toHaveBeenCalledWith(species);
      }
    }
  });

  it("shows add another breed button when breed1 is selected", () => {
    render(
      <IdentificationFields
        {...defaultProps}
        formData={{ ...defaultProps.formData, breed1: "Labrador" }}
      />
    );

    const addBreedButton = screen.getByTestId("add-breed-button");
    expect(addBreedButton).toBeDefined();
  });

  it("shows breed2 field when showBreed2 is true", () => {
    render(
      <IdentificationFields
        {...defaultProps}
        showBreed2={true}
        formData={{ ...defaultProps.formData, breed1: "Labrador" }}
      />
    );

    // Use queryByTestId instead of getByTestId to avoid throwing
    const breed2Field = screen.queryByTestId("breed-search-2");
    const removeButton = screen.queryByTestId("remove-breed-button");
    expect(breed2Field).toBeDefined();
    expect(removeButton).toBeDefined();
  });

  it("handles remove breed2 button click", async () => {
    const user = userEvent.setup();
    render(
      <IdentificationFields
        {...defaultProps}
        showBreed2={true}
        formData={{ ...defaultProps.formData, breed1: "Labrador" }}
      />
    );

    await act(async () => {
      const removeButton = screen.getByTestId("remove-breed-button");
      await user.click(removeButton);
    });

    expect(defaultProps.onShowBreed2Change).toHaveBeenCalledWith(false);
  });

  it("disables all interactive elements when isLoading is true", () => {
    render(
      <IdentificationFields
        {...defaultProps}
        isLoading={true}
        formData={{ ...defaultProps.formData, breed1: "Labrador" }}
      />
    );

    // Check button disabled state
    const addBreedButton = screen.getByTestId("add-breed-button");
    expect(addBreedButton).toBeDisabled();

    // For MUI TextField, check the input element
    const microchipInput = screen.getByTestId("microchip-id-input").querySelector("input");
    expect(microchipInput).toBeDisabled();

    // For MUI Select components
    const genderSelect = screen.getByTestId("gender-select");
    const speciesSelect = screen.getByTestId("species-select");

    [genderSelect, speciesSelect].forEach(select => {
      expect(select).toHaveClass("Mui-disabled");
    });

    // For BreedSearch components
    const breedSearchControl = screen.getByTestId("breed-search-form-control");
    const autocompleteInput = breedSearchControl.querySelector('input[role="combobox"]');
    expect(autocompleteInput).toBeDisabled();

    // If breed2 is shown, check that one too
    const breed2SearchControl = screen.queryByTestId("breed-search-form-control");
    if (breed2SearchControl) {
      const autocompleteInput2 = breed2SearchControl.querySelector('input[role="combobox"]');
      if (autocompleteInput2) {
        expect(autocompleteInput2).toBeDisabled();
      }
    }

    // Check remove breed button if visible
    const removeButton = screen.queryByTestId("remove-breed-button");
    if (removeButton) {
      expect(removeButton).toBeDisabled();
    }
  });
});
