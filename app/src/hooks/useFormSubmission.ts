import { ReportPropsForm } from "../types/Report";

export const useFormSubmission = (
  handleSubmit: (formData: ReportPropsForm, selectedImage: File | null) => Promise<void>
) => {
  const onSubmit = async (
    e: React.FormEvent,
    formData: ReportPropsForm,
    selectedImage: File | null
  ) => {
    e.preventDefault();
    await handleSubmit(formData, selectedImage);
  };

  return { onSubmit };
};
