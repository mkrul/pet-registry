import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PetPropsForm } from "../types/Pet";

interface ValidationError {
  validationErrors?: string[];
  message?: string;
}

export const usePetFormSubmission = (handleSubmit: any) => {
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent, formData: PetPropsForm, selectedImage: File | null) => {
    try {
      const response = await handleSubmit(formData, selectedImage);
      if (response?.id) {
        navigate(`/dashboard?section=pets`);
      }
    } catch (error) {
      const validationError = error as ValidationError;

      if (validationError.validationErrors) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
