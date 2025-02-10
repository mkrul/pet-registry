import { ReportPropsForm } from "../types/Report";
import { UseReportSubmitProps } from "../types/hooks/Report";
import { createFormData } from "../utils/formData";

export const useReportSubmit = ({
  submitReport,
  showBreed2,
  showColor2,
  showColor3
}: UseReportSubmitProps) => {
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
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { handleSubmit };
};
