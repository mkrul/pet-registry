import { useNavigate } from "react-router-dom";

export const usePetFormSubmission = (handleSubmit) => {
  const navigate = useNavigate();

  const onSubmit = async (e, formData, selectedImage) => {
    console.log("[usePetFormSubmission] Starting pet form submission");
    console.log("[usePetFormSubmission] Form data:", formData);
    console.log("[usePetFormSubmission] Selected image:", selectedImage);

    try {
      const response = await handleSubmit(formData, selectedImage);
      console.log("[usePetFormSubmission] Submission successful, response:", response);

      if (response?.id) {
        console.log("[usePetFormSubmission] Navigating to /dashboard/pets");
        navigate(`/dashboard/pets`);
      } else {
        console.warn("[usePetFormSubmission] Response missing id, not navigating");
      }
    } catch (error) {
      console.error("[usePetFormSubmission] Submission failed with error:", error);
      const validationError = error;

      if (validationError.validationErrors) {
        console.log("[usePetFormSubmission] Validation errors detected:", validationError.validationErrors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      console.error("[usePetFormSubmission] Non-validation error:", error);
    }
  };

  return { onSubmit };
};
