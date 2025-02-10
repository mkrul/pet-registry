import { useDispatch } from "react-redux";
import { setNotification } from "../redux/features/notifications/notificationsSlice";
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

    await handleSubmit(formData, selectedImage);
  };

  return { onSubmit };
};
