import React, { useState } from "react";
import {
  useSubmitReportMutation
} from "../../../store/features/reports/reportsApi.js";
import { useReportForm } from "../../../shared/hooks/useReportForm.js";
import { useReportSubmit } from "../../../shared/hooks/useReportSubmit.js";
import { useFormSubmission } from "../../../shared/hooks/useFormSubmission.js";
import { BasicInfoFields } from "../../listings/components/common/BasicInfoFields.jsx";
import { IdentificationFields } from "../../listings/components/common/IdentificationFields.jsx";
import { ColorFields } from "../../listings/components/common/ColorFields.jsx";
import { ImageUpload } from "../../listings/components/common/ImageUpload.jsx";
import { LocationSelect } from "../../listings/components/common/LocationSelect.jsx";
import { SubmitButton } from "../../../shared/components/common/SubmitButton.jsx";
import { FormPopulateButton } from "../../../shared/components/common/FormPopulateButton.jsx";

const ReportNewForm = ({ initialData, petId }) => {
  const [submitReport, { isLoading }] = useSubmitReportMutation();

  const {
    formData,
    setFormData,
    selectedImage,
    imagePreview,
    handleInputChange,
    handleLocationSelect,
    handleImageSelect,
    handleImageLoad,
    handleImageError,
    getInitialLocation
  } = useReportForm(initialData);


  const { handleSubmit } = useReportSubmit({
    submitReport
  });

  const { onSubmit } = useFormSubmission(handleSubmit);

  const handleFormSubmit = (
    e,
    formData,
    selectedImage
  ) => {
    e.preventDefault();

    onSubmit(e, formData, selectedImage, petId);
  };

  const handleLocationUpdate = (location) => {
    handleLocationSelect(location);
  };

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={e => handleFormSubmit(e, formData, selectedImage)}
      encType="multipart/form-data"
      noValidate
    >
      <FormPopulateButton
        setFormData={setFormData}
        handleImageSelect={handleImageSelect}
      />

      <div className="mt-[0.5rem]">
        <p className="text-md text-gray-500">
          Use this form to report a lost or found pet in your area. Please include as many details
          as possible in the description, and upload your best photo of the animal.
        </p>
      </div>

      <BasicInfoFields
        formData={formData}
        onInputChange={handleInputChange}
        error={""}
        descriptionError={""}
      />

      <IdentificationFields
        formData={formData}
        onInputChange={handleInputChange}
        isLoading={isLoading}
        error={""}
        breedError={""}
        alteredError={""}
        microchipError={""}
      />

      <ColorFields
        formData={formData}
        isLoading={isLoading}
        handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
        handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
        handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
        error={""}
      />

      <ImageUpload
        onImageSelect={handleImageSelect}
        preview={imagePreview}
        disabled={isLoading}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        error={""}
      />

      <LocationSelect
        onLocationSelect={handleLocationUpdate}
        initialLocation={getInitialLocation()}
        isLoading={isLoading}
        error={""}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default ReportNewForm;
