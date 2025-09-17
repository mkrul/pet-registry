import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ReportPropsForm } from "../types/redux/features/reports/ReportsApi";

interface ValidationError {
  validationErrors?: string[];
  message?: string;
}

export const useFormSubmission = (handleSubmit: any) => {
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent, formData: ReportPropsForm, selectedImage: File | null, petId?: number) => {
    try {
      const response = await handleSubmit(formData, selectedImage, petId);
      if (response?.id) {
        setTimeout(() => {
          navigate(`/dashboard?section=reports&reportId=${response.id}`);
        }, 100);
      }
    } catch (error) {
      const validationError = error as ValidationError;

      // If it's a validation error, scroll to top to show the notification
      if (validationError.validationErrors) {
        console.log("Validation errors:", validationError.validationErrors);
        // Scroll to top to ensure user sees the error notification
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // For other errors, log them but don't show additional notifications
      // as useReportSubmit already handles error notifications
      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
