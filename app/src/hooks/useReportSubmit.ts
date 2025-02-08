import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationType, NotificationState } from "../types/common/Notification";
import { ReportPropsForm } from "../types/Report";
import { UseReportSubmitProps } from "../types/hooks/Report";
import { ReportResponse } from "../types/Report";
import { useDispatch } from "react-redux";
import { setNotification } from "../redux/features/notifications/notificationsSlice";

export const useReportSubmit = ({
  submitReport,
  showBreed2,
  showColor2,
  showColor3
}: UseReportSubmitProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prepareFormData = (formData: ReportPropsForm, selectedImage: File | null) => {
    console.log("Preparing form data, altered value:", formData.altered);
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
      longitude: formData.longitude,
      intersection: formData.intersection,
      altered: formData.altered
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

  const handleSubmit = async (formData: ReportPropsForm, selectedImage: File | null) => {
    dispatch(setNotification(null));
    const formDataToSend = prepareFormData(formData, selectedImage);

    try {
      const response = (await submitReport(formDataToSend)) as ReportResponse;
      navigate(`/reports/${response.report.id}`, {
        state: { notification: { type: NotificationType.SUCCESS, message: response.message } }
      });
    } catch (error: any) {
      dispatch(
        setNotification({
          type: NotificationType.ERROR,
          message: error.data?.message
        })
      );
    }
  };

  return { handleSubmit };
};
