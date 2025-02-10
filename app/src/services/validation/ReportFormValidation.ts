import { ReportPropsForm, LocationData } from "../../types/Report";
import { Dispatch, SetStateAction } from "react";

export interface ValidationErrors {
  title: string;
  description: string;
  species: string;
  breed1: string;
  color1: string;
  image: string;
  location: string;
  altered: string;
  microchipId: string;
}

export const validateReportForm = (
  formData: ReportPropsForm,
  selectedImage: File | null
): ValidationErrors => {
  const errors: ValidationErrors = {
    title: "",
    description: "",
    species: "",
    breed1: "",
    color1: "",
    image: "",
    location: "",
    altered: "",
    microchipId: ""
  };

  if (!formData.title?.trim()) {
    errors.title = "Please enter a title";
  }

  if (!formData.description?.trim()) {
    errors.description = "Please enter a description";
  }

  if (formData.altered === null) {
    errors.altered = "Please indicate whether the animal is spayed or neutered";
  }

  if (!formData.species) {
    errors.species = "Please select a species";
  }

  if (!formData.breed1) {
    errors.breed1 = "Please select a breed";
  }

  if (!formData.color1) {
    errors.color1 = "Please select a color";
  }

  if (!selectedImage) {
    errors.image = "Please upload an image";
  }

  if (!formData.latitude || !formData.longitude) {
    errors.location = "Please select a location";
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== "");
};

export interface ValidationFieldSelectors {
  [key: string]: string;
}

const errorFieldSelectors: ValidationFieldSelectors = {
  title: 'input[name="title"]',
  description: 'textarea[name="description"]',
  altered: 'input[name="altered"]',
  species: 'input[name="species"]',
  breed1: ".MuiAutocomplete-input",
  color1: ".MuiAutocomplete-input",
  image: 'input[type="file"]'
};

export const scrollToFirstError = (errors: ValidationErrors): void => {
  const firstErrorField = Object.entries(errors).find(([_, value]) => value !== "")?.[0];
  const selector = errorFieldSelectors[firstErrorField as string];

  if (selector) {
    const element =
      firstErrorField === "color1"
        ? document.querySelector(selector)?.closest(".space-y-2")
        : document.querySelector(selector);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

export const getInitialErrors = (): ValidationErrors => ({
  title: "",
  description: "",
  species: "",
  breed1: "",
  color1: "",
  image: "",
  location: "",
  altered: "",
  microchipId: ""
});

export interface ValidationErrorSetter {
  setFieldErrors: Dispatch<SetStateAction<ValidationErrors>>;
}

export const handleLocationValidation = (
  location: LocationData,
  { setFieldErrors }: ValidationErrorSetter
): boolean => {
  if (location.error) {
    setFieldErrors(prev => ({ ...prev, location: location.error || "" }));
    return false;
  }
  setFieldErrors(prev => ({ ...prev, location: "" }));
  return true;
};

export const getFieldFromMessage = (message: string): keyof ValidationErrors => {
  const fieldPatterns = {
    title: /title/i,
    description: /description/i,
    species: /species/i,
    breed1: /breed/i,
    color1: /color/i,
    altered: /spayed|neutered/i,
    microchipId: /microchip/i
  };

  for (const [field, pattern] of Object.entries(fieldPatterns)) {
    if (pattern.test(message)) {
      return field as keyof ValidationErrors;
    }
  }
  return "title";
};

export const handleReportValidationErrors = (
  reportValidations: Record<string, string>,
  { setFieldErrors }: ValidationErrorSetter
): void => {
  console.log("Handling validation errors:", reportValidations);
  const mappedErrors =
    "message" in reportValidations
      ? { [getFieldFromMessage(reportValidations.message)]: reportValidations.message }
      : mapIdentificationFieldErrors(reportValidations);
  console.log("Mapped validation errors:", mappedErrors);
  setFieldErrors(prev => {
    const newErrors = {
      ...prev,
      ...mappedErrors
    };
    console.log("New field errors state:", newErrors);
    return newErrors;
  });
};

export const mapIdentificationFieldErrors = (
  serverErrors: Record<string, string>
): Partial<ValidationErrors> => {
  console.log("Server errors received:", serverErrors);
  const fieldMapping: Record<string, keyof ValidationErrors> = {
    title: "title",
    description: "description",
    species: "species",
    breed_1: "breed1",
    breed_2: "breed2",
    color_1: "color1",
    altered: "altered",
    microchip_id: "microchipId"
  };

  const mappedErrors = Object.entries(serverErrors).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [fieldMapping[key] || key]: value
    }),
    {}
  );
  console.log("Mapped errors result:", mappedErrors);
  return mappedErrors;
};
