import React from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../../redux/features/reports/reportsApi";
import { useReportForm } from "../../../hooks/useReportForm";
import { useReportSubmit } from "../../../hooks/useReportSubmit";
import { useFormSubmission } from "../../../hooks/useFormSubmission";
import { BasicInfoFields } from "../common/BasicInfoFields";
import { IdentificationFields } from "../common/IdentificationFields";
import { ColorFields } from "../common/ColorFields";
import { ImageUpload } from "../common/ImageUpload";
import { LocationSelect } from "../common/LocationSelect";
import { SubmitButton } from "../../common/SubmitButton";
import Spinner from "../../common/Spinner";
import { FormPopulateButton } from "../../common/FormPopulateButton";
import { useNotificationCleanup } from "../../../hooks/useNotificationCleanup";

const NewReportForm: React.FC = () => {
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
  const [submitReport, { isLoading }] = useSubmitReportMutation();

  const {
    formData,
    setFormData,
    selectedImage,
    imagePreview,
    showBreed2,
    showColor2,
    showColor3,
    handleInputChange,
    handleLocationSelect,
    removeColor2,
    removeColor3,
    handleImageSelect,
    removeBreed2,
    showBreed2Field,
    showColor2Field,
    showColor3Field,
    handleImageLoad,
    handleImageError,
    getInitialLocation
  } = useReportForm();

  const { handleSubmit } = useReportSubmit({
    submitReport: data => submitReport(data).unwrap(),
    showBreed2,
    showColor2,
    showColor3
  });

  const { onSubmit } = useFormSubmission(handleSubmit);

  useNotificationCleanup();

  if (isLoadingNewReport) return <Spinner />;

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={e => onSubmit(e, formData, selectedImage)}
      encType="multipart/form-data"
    >
      <FormPopulateButton
        setFormData={setFormData}
        handleImageSelect={handleImageSelect}
        showColor2Field={showColor2Field}
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
        onInputChange={handleInputChange}
        setShowBreed2={showBreed2Field}
        onBreed2Remove={removeBreed2}
        isLoading={isLoading}
      />

      <ColorFields
        formData={formData}
        showColor2={showColor2}
        showColor3={showColor3}
        setShowColor2={showColor2Field}
        setShowColor3={showColor3Field}
        onColor2Add={showColor2Field}
        onColor3Add={showColor3Field}
        onColor2Remove={removeColor2}
        onColor3Remove={removeColor3}
        isLoading={isLoading}
        handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
        handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
        handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
      />

      <ImageUpload
        onImageSelect={handleImageSelect}
        preview={imagePreview}
        disabled={isLoading}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />

      <LocationSelect
        onLocationSelect={handleLocationSelect}
        initialLocation={getInitialLocation()}
        isLoading={isLoading}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default NewReportForm;
