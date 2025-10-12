import { createPetFormData } from "../utils/petFormData";
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/features/notifications/notificationsSlice.js";

export const usePetSubmit = ({
  submitPet
}) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData, selectedImage) => {
    console.log("[usePetSubmit] Creating FormData from:", { formData, selectedImage });
    const data = createPetFormData(formData, selectedImage);

    console.log("[usePetSubmit] FormData created, logging entries:");
    for (let [key, value] of data.entries()) {
      console.log(`  ${key}:`, value);
    }

    try {
      console.log("[usePetSubmit] Calling submitPet mutation");
      const response = await submitPet(data);
      console.log("[usePetSubmit] Mutation response received:", response);

      if ("error" in response) {
        const error = response.error;
        console.error("[usePetSubmit] Error in response:", error);

        if (error.status === 422 && error.data) {
          const validationError = error.data;
          console.error("[usePetSubmit] Validation error (422):", validationError);
          dispatch(
            addNotification({
              type: "ERROR",
              message: validationError.message || "Please fix the validation errors below"
            })
          );
          throw { validationErrors: validationError.errors, message: validationError.message };
        }

        console.error("[usePetSubmit] Non-validation error, status:", error.status);
        dispatch(
          addNotification({
            type: "ERROR",
            message: "An error occurred while registering the pet. Please try again."
          })
        );
        throw error;
      }

      console.log("[usePetSubmit] Success response, data:", response.data);
      if (response.data?.message) {
        console.log("[usePetSubmit] Dispatching success notification:", response.data.message);
        dispatch(
          addNotification({
            type: "SUCCESS",
            message: response.data.message
          })
        );
      }

      return response.data;
    } catch (error) {
      console.error("[usePetSubmit] Caught error in handleSubmit:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
