import { createPetFormData } from "../utils/petFormData";
import { useDispatch } from "react-redux";
import { setNotification } from "../../store/features/notifications/notificationsSlice";

export const usePetSubmit = ({
  submitPet
}) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData, selectedImage) => {
    const data = createPetFormData(formData, selectedImage);

    try {
      const response = await submitPet(data);
      if ("error" in response) {
        const error = response.error;

        if (error.status === 422 && error.data) {
          const validationError = error.data;
          dispatch(
            setNotification({
              type: "ERROR",
              message: validationError.message || "Please fix the validation errors below"
            })
          );
          throw { validationErrors: validationError.errors, message: validationError.message };
        }

        dispatch(
          setNotification({
            type: "ERROR",
            message: "An error occurred while registering the pet. Please try again."
          })
        );
        throw error;
      }

      if (response.data?.message) {
        dispatch(
          setNotification({
            type: "SUCCESS",
            message: response.data.message
          })
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { handleSubmit };
};
