import { PetPropsForm } from "../types/Pet";
import { createPetFormData } from "../utils/petFormData";
import { useDispatch } from "react-redux";
import { setNotification } from "../../store/features/notifications/notificationsSlice";
import { NotificationType } from "../types/common/Notification";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ValidationErrorResponse {
  errors: string[];
  message: string;
}

interface UsePetSubmitProps {
  submitPet: any;
}

export const usePetSubmit = ({
  submitPet
}: UsePetSubmitProps) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData: PetPropsForm, selectedImage: File | null) => {
    const data = createPetFormData(formData, selectedImage);

    try {
      const response = await submitPet(data);
      if ("error" in response) {
        const error = response.error as FetchBaseQueryError;

        if (error.status === 422 && error.data) {
          const validationError = error.data as ValidationErrorResponse;
          dispatch(
            setNotification({
              type: NotificationType.ERROR,
              message: validationError.message || "Please fix the validation errors below"
            })
          );
          throw { validationErrors: validationError.errors, message: validationError.message };
        }

        dispatch(
          setNotification({
            type: NotificationType.ERROR,
            message: "An error occurred while registering the pet. Please try again."
          })
        );
        throw error;
      }

      if (response.data?.message) {
        dispatch(
          setNotification({
            type: NotificationType.SUCCESS,
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
