import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ReportPropsForm } from "../types/redux/features/reports/ReportsApi";

export const useFormSubmission = (handleSubmit: any) => {
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent, formData: ReportPropsForm, selectedImage: File | null) => {
    try {
      const response = await handleSubmit(formData, selectedImage);
      if (response?.id) {
        navigate(`/reports/${response.id}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
