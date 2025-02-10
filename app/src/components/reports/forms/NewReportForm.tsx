import React, { useState } from "react";
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
import { ReportPropsForm, LocationData } from "../../../types/Report";
import {
  validateReportForm,
  hasValidationErrors,
  scrollToFirstError,
  getInitialErrors,
  handleLocationValidation,
  handleReportValidationErrors,
  getFieldFromMessage
} from "../../../services/validation/ReportFormValidation";

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

  const [fieldErrors, setFieldErrors] = useState(getInitialErrors());

  const { handleSubmit } = useReportSubmit({
    submitReport: async data => {
      try {
        const response = await submitReport(data);
        console.log("Submit response:", response);
        if ("error" in response) {
          const error = response.error;
          console.log("Submit error data:", error?.data);
          if (error?.data?.message) {
            handleReportValidationErrors({ message: error.data.message }, { setFieldErrors });
            scrollToFirstError({ [getFieldFromMessage(error.data.message)]: error.data.message });
            return { message: "Validation failed" };
          }
          throw error;
        }
        return response.data;
      } catch (error) {
        console.log("Submit catch error:", error);
        throw error;
      }
    },
    showBreed2,
    showColor2,
    showColor3
  });

  const { onSubmit } = useFormSubmission(handleSubmit);

  const handleFormSubmit = (
    e: React.FormEvent,
    formData: ReportPropsForm,
    selectedImage: File | null
  ) => {
    e.preventDefault();
    console.log("Form submit started with data:", formData);
    setFieldErrors(getInitialErrors());

    const validationErrors = validateReportForm(formData, selectedImage);
    console.log("Frontend validation errors:", validationErrors);

    if (hasValidationErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      scrollToFirstError(validationErrors);
      return;
    }

    onSubmit(e, formData, selectedImage);
  };

  const handleLocationUpdate = (location: LocationData) => {
    if (handleLocationValidation(location, { setFieldErrors })) {
      handleLocationSelect(location);
    }
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
        showColor2Field={showColor2Field}
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
        error={fieldErrors.title}
        descriptionError={fieldErrors.description}
      />

      <IdentificationFields
        formData={formData}
        showBreed2={showBreed2}
        onInputChange={handleInputChange}
        setShowBreed2={showBreed2Field}
        onBreed2Remove={removeBreed2}
        isLoading={isLoading}
        error={fieldErrors.species}
        breedError={fieldErrors.breed1}
        alteredError={fieldErrors.altered}
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
        error={fieldErrors.color1}
      />

      <ImageUpload
        onImageSelect={handleImageSelect}
        preview={imagePreview}
        disabled={isLoading}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        error={fieldErrors.image}
      />

      <LocationSelect
        onLocationSelect={handleLocationUpdate}
        initialLocation={getInitialLocation()}
        isLoading={isLoading}
        error={fieldErrors.location}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default NewReportForm;
