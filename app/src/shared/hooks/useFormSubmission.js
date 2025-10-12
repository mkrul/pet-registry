import { useNavigate } from "react-router-dom";

export const useFormSubmission = (handleSubmit) => {
  const navigate = useNavigate();

  const onSubmit = async (e, formData, selectedImage, petId) => {
    try {
      const response = await handleSubmit(formData, selectedImage, petId);
      if (response?.id) {
        setTimeout(() => {
          navigate(`/dashboard/reports?reportId=${response.id}`);
        }, 100);
      }
    } catch (error) {
      if (error.validationErrors) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      console.error("Form submission error:", error);
    }
  };

  return { onSubmit };
};
