import { useDispatch } from "react-redux";
import { setNotification } from "../redux/features/notifications/notificationsSlice";
import { validateReportForm } from "../services/validation/ReportFormValidation";
import { NotificationType } from "../types/common/Notification";
import { ReportPropsForm } from "../types/Report";

export const useFormSubmission = (
  handleSubmit: (formData: ReportPropsForm, selectedImage: File | null) => Promise<void>
) => {
  const dispatch = useDispatch();

  const onSubmit = async (
    e: React.FormEvent,
    formData: ReportPropsForm,
    selectedImage: File | null
  ) => {
    e.preventDefault();
    dispatch(setNotification(null));

    const validationError = validateReportForm(formData, selectedImage);
    if (validationError) {
      dispatch(
        setNotification({
          type: NotificationType.ERROR,
          message: validationError
        })
      );
      return;
    }

    await handleSubmit(formData, selectedImage);
  };

  return { onSubmit };
};
