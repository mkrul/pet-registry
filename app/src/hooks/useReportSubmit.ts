import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationType } from "../types/Notification";
import { IReportForm } from "../types/Report";

interface UseReportSubmitProps {
  submitReport: (data: FormData) => Promise<{ report?: any; message?: string }>;
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
}

export const useReportSubmit = ({
  submitReport,
  showBreed2,
  showColor2,
  showColor3
}: UseReportSubmitProps) => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  const prepareFormData = (formData: IReportForm, selectedImage: File | null) => {
    const formDataToSend = new FormData();
    const data = {
      title: formData.title,
      description: formData.description,
      name: formData.name,
      gender: formData.gender,
      species: formData.species.toLowerCase(),
      breed_1: formData.breed1,
      breed_2: showBreed2 && formData.breed2 ? formData.breed2 : null,
      color_1: formData.color1?.toLowerCase(),
      color_2: showColor2 && formData.color2 ? formData.color2.toLowerCase() : null,
      color_3: showColor3 && formData.color3 ? formData.color3.toLowerCase() : null,
      microchip_id: formData.microchipId,
      area: formData.area,
      state: formData.state,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude
    };

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    return formDataToSend;
  };

  const handleSubmit = async (formData: IReportForm, selectedImage: File | null) => {
    setNotification(null);
    const formDataToSend = prepareFormData(formData, selectedImage);

    try {
      const response = await submitReport(formDataToSend);
      if (response.report) {
        navigate(`/reports/${response.report.id}`);
      } else {
        setNotification({
          type: NotificationType.ERROR,
          message: response.message || "Failed to create report"
        });
      }
    } catch (error: any) {
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || "Failed to create report"
      });
    }
  };

  return {
    handleSubmit,
    notification,
    setNotification
  };
};
