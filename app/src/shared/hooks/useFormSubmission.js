import { useNavigate } from "react-router-dom";

export const useFormSubmission = (handleSubmit) => {
  const navigate = useNavigate();

  const onSubmit = async (e, formData, selectedImage, petId) => {
    try {
      const response = await handleSubmit(formData, selectedImage, petId);
      if (response?.id) {
        setTimeout(() => {
          navigate(`/dashboard?section=reports&reportId=${response.id}`);
        }, 100);
      }
    } catch (error) {
      // If it's a validation error, scroll to top to show the notification
      if (error.validationErrors) {
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
