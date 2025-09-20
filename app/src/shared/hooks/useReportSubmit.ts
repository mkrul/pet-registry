import { ReportPropsForm } from "../types/Report";
import { UseReportSubmitProps } from "../types/hooks/Report";
import { createFormData } from "../utils/formData";
import { useDispatch } from "react-redux";
import { setNotification } from "../../store/features/notifications/notificationsSlice";
import { NotificationType } from "../types/common/Notification";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ValidationErrorResponse {
  errors: string[];
  message: string;
}

export const useReportSubmit = ({
  submitReport
}: UseReportSubmitProps) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData: ReportPropsForm, selectedImage: File | null, petId?: number) => {
    const data = createFormData(formData, selectedImage, petId);

    try {
      const response = await submitReport(data);
      if ("error" in response) {
        const error = response.error as FetchBaseQueryError;

        // Handle validation errors (422 status)
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

        // Handle other API errors
        dispatch(
          setNotification({
            type: NotificationType.ERROR,
            message: "An error occurred while creating the report. Please try again."
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
