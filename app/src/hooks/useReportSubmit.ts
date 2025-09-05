import { ReportPropsForm } from "../types/Report";
import { UseReportSubmitProps } from "../types/hooks/Report";
import { createFormData } from "../utils/formData";
import { useDispatch } from "react-redux";
import { setNotification } from "../redux/features/notifications/notificationsSlice";
import { NotificationType } from "../types/common/Notification";

export const useReportSubmit = ({
  submitReport,
  showBreed2,
  showColor2,
  showColor3
}: UseReportSubmitProps) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData: ReportPropsForm, selectedImage: File | null) => {
    const data = createFormData(formData, selectedImage, {
      showBreed2,
      showColor2,
      showColor3
    });

    try {
      const response = await submitReport(data);
      if ("error" in response) {
        throw response.error;
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
