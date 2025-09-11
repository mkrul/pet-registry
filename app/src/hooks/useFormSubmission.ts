import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ReportPropsForm } from "../types/redux/features/reports/ReportsApi";

interface ValidationError {
  validationErrors?: string[];
  message?: string;
}

export const useFormSubmission = (handleSubmit: any) => {
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent, formData: ReportPropsForm, selectedImage: File | null) => {
    try {
      const response = await handleSubmit(formData, selectedImage);
      if (response?.id) {
        navigate(`/reports/${response.id}`);
      }
    } catch (error) {
      const validationError = error as ValidationError;

      // If it's a validation error, we don't need to do anything here
      // as the notification is already handled in useReportSubmit
      if (validationError.validationErrors) {
        console.log("Validation errors:", validationError.validationErrors);
        return;
      }

      // For other errors, log them but don't show additional notifications
      // as useReportSubmit already handles error notifications
      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
