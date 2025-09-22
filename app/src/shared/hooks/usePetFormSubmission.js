import { useNavigate } from "react-router-dom";

export const usePetFormSubmission = (handleSubmit) => {
  const navigate = useNavigate();

  const onSubmit = async (e, formData, selectedImage) => {
    try {
      const response = await handleSubmit(formData, selectedImage);
      if (response?.id) {
        navigate(`/dashboard?section=pets`);
      }
    } catch (error) {
      const validationError = error;

      if (validationError.validationErrors) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
