import { createFormData } from "../utils/formData";
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/features/notifications/notificationsSlice.js";

export const useReportSubmit = ({
  submitReport
}) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData, selectedImage, petId) => {
    const data = createFormData(formData, selectedImage, petId);

    try {
      const response = await submitReport(data);
      if ("error" in response) {
        const error = response.error;

        // Handle validation errors (422 status)
        if (error.status === 422 && error.data) {
          const validationError = error.data;
          dispatch(
            addNotification({
              type: "ERROR",
              message: validationError.message || "Please fix the validation errors below"
            })
          );
          throw { validationErrors: validationError.errors, message: validationError.message };
        }

        // Handle other API errors
        dispatch(
          addNotification({
            type: "ERROR",
            message: "An error occurred while creating the report. Please try again."
          })
        );
        throw error;
      }

      if (response.data?.message) {
        dispatch(
          addNotification({
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
