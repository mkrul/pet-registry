import React, { useState, FormEvent } from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../../../store/features/reports/reportsApi";
import { useReportForm } from "../../../../shared/hooks/useReportForm";
import { useReportSubmit } from "../../../../shared/hooks/useReportSubmit";
import { useFormSubmission } from "../../../../shared/hooks/useFormSubmission";
import { BasicInfoFields } from "../common/BasicInfoFields";
import { IdentificationFields } from "../common/IdentificationFields";
import { ColorFields } from "../common/ColorFields";
import { ImageUpload } from "../common/ImageUpload";
import { LocationSelect } from "../common/LocationSelect";
import { SubmitButton } from "../../../../shared/components/common/SubmitButton";
import Spinner from "../../../../shared/components/common/Spinner";
import { FormPopulateButton } from "../../../../shared/components/common/FormPopulateButton";
import {
  ReportPropsForm,
  LocationData
} from "../../../../shared/types/redux/features/reports/ReportsApi";

interface NewReportFormProps {
  initialData?: Partial<ReportPropsForm>;
  petId?: number;
}

const NewReportForm: React.FC<NewReportFormProps> = ({ initialData, petId }) => {
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
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
    e: FormEvent<HTMLFormElement>,
    formData: ReportPropsForm,
    selectedImage: File | null
  ) => {
    e.preventDefault();

    onSubmit(e, formData, selectedImage, petId);
  };

  const handleLocationUpdate = (location: LocationData) => {
    handleLocationSelect(location);
  };

  if (isLoadingNewReport) return <Spinner />;

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

export default NewReportForm;
