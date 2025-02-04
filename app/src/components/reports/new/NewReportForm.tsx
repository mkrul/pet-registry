import React, { useEffect } from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../../redux/features/reports/reportsApi";
import { SelectChangeEvent } from "@mui/material";
import { useReportForm } from "../../../hooks/useReportForm";
import { useReportSubmit } from "../../../hooks/useReportSubmit";
import { validateReportForm } from "../../../services/validation/ReportFormValidation";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { IdentificationFields } from "../form/IdentificationFields";
import { ColorFields } from "../form/ColorFields";
import { ImageUpload } from "../form/ImageUpload";
import { LocationSelect } from "../form/LocationSelect";
import { SubmitButton } from "../../common/SubmitButton";
import Notification from "../../common/Notification";
import Spinner from "../../common/Spinner";
import { NotificationType } from "../../../types/common/Notification";
import { Button } from "@mui/material";
import { FormPopulateButton } from "../../development/FormPopulateButton";
import { useDispatch } from "react-redux";
import { setNotification } from "../../../redux/features/notifications/notificationsSlice";
import { commonInputStyles } from "../../../styles/commonStyles";

const NewReportForm: React.FC = () => {
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
  const [submitReport, { isLoading }] = useSubmitReportMutation();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (formData.color2) {
      setShowColor2(true);
    }
    if (formData.color3) {
      setShowColor3(true);
    }
  }, [formData.color2, formData.color3]);

  const { handleSubmit } = useReportSubmit({
    submitReport: data => submitReport(data).unwrap(),
    showBreed2,
    showColor2,
    showColor3
  });

  const onSubmit = async (e: React.FormEvent) => {
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

  useEffect(() => {
    return () => {
      dispatch(setNotification(null));
    };
  }, [dispatch]);

  if (isLoadingNewReport) return <Spinner />;

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={onSubmit}
      encType="multipart/form-data"
      noValidate
    >
      <FormPopulateButton
        setFormData={setFormData}
        setSelectedImage={setSelectedImage}
        setImagePreview={setImagePreview}
        setShowBreed2={setShowBreed2}
        setShowColor2={setShowColor2}
        setShowColor3={setShowColor3}
      />

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
        onInputChange={
          handleInputChange as (
            e:
              | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              | SelectChangeEvent
              | { target: { name: string; value: string | null } }
          ) => void
        }
        onBreedChange={breed => setFormData(prev => ({ ...prev, breed1: breed }))}
        onBreed2Change={breed => setFormData(prev => ({ ...prev, breed2: breed }))}
        onSpeciesChange={handleSpeciesChange}
        onShowBreed2Change={setShowBreed2}
        isLoading={isLoading}
      />

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
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
      </div>

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

      <LocationSelect
        onLocationSelect={handleLocationSelect}
        initialLocation={{
          latitude: formData.latitude,
          longitude: formData.longitude,
          area: formData.area || "",
          state: formData.state || "",
          country: formData.country || "",
          intersection: formData.intersection
        }}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default NewReportForm;
