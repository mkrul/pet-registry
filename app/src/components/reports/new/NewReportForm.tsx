import React from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../../redux/features/reports/reportsApi";
import { SelectChangeEvent } from "@mui/material";
import { useReportForm } from "../../../hooks/useReportForm";
import { useReportSubmit } from "../../../hooks/useReportSubmit";
import { validateReportForm } from "../form/ReportFormValidation";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { IdentificationFields } from "../form/IdentificationFields";
import { ColorFields } from "../form/ColorFields";
import { ImageUpload } from "../form/ImageUpload";
import { ReportLocationSelect } from "../form/ReportLocationSelect";
import { SubmitButton } from "../../common/SubmitButton";
import Notification from "../../common/Notification";
import Spinner from "../../common/Spinner";
import { NotificationType } from "../../../types/common/Notification";

const NewReportForm: React.FC = () => {
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
  const [submitReport, { isLoading }] = useSubmitReportMutation();

  const {
    formData,
    setFormData,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    showBreed2,
    setShowBreed2,
    showColor2,
    setShowColor2,
    showColor3,
    setShowColor3,
    handleInputChange,
    handleSpeciesChange,
    handleLocationSelect
  } = useReportForm();

  const { handleSubmit, notification, setNotification } = useReportSubmit({
    submitReport: data => submitReport(data).unwrap(),
    showBreed2,
    showColor2,
    showColor3
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const validationError = validateReportForm(formData, selectedImage);
    if (validationError) {
      setNotification({
        type: NotificationType.ERROR,
        message: validationError
      });
      return;
    }

    await handleSubmit(formData, selectedImage);
  };

  if (isLoadingNewReport) return <Spinner />;

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={onSubmit}
      encType="multipart/form-data"
      noValidate
    >
      {notification?.type === NotificationType.SUCCESS && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mt-[0.5rem]">
        <p className="text-md text-gray-500">
          Please include as many details as possible in the description, and upload your best photo
          of the animal.
        </p>
      </div>

      <BasicInfoFields formData={formData} onInputChange={handleInputChange} />

      <IdentificationFields
        formData={formData}
        showBreed2={showBreed2}
        onInputChange={handleInputChange}
        onBreedChange={breed => setFormData(prev => ({ ...prev, breed1: breed }))}
        onBreed2Change={breed => setFormData(prev => ({ ...prev, breed2: breed }))}
        onSpeciesChange={handleSpeciesChange}
        onShowBreed2Change={setShowBreed2}
        isLoading={isLoading}
      />

      <ColorFields
        formData={formData}
        showColor2={showColor2}
        showColor3={showColor3}
        onInputChange={
          handleInputChange as (
            e: SelectChangeEvent | { target: { name: string; value: string | null } }
          ) => void
        }
        onShowColor2Change={setShowColor2}
        onShowColor3Change={setShowColor3}
        isLoading={isLoading}
      />

      <ImageUpload
        onImageSelect={file => {
          setSelectedImage(file);
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
        }}
        preview={imagePreview}
        disabled={isLoading}
      />

      <ReportLocationSelect onLocationSelect={handleLocationSelect} />

      {notification?.type === NotificationType.ERROR && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default NewReportForm;
