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
import { ReportLocationSelect } from "../components/ReportLocationSelect.jsx";
import { FormPopulateButton } from "../../../shared/components/common/FormPopulateButton.jsx";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const ReportNewForm = ({ initialData, petId }) => {
  const [submitReport, { isLoading }] = useSubmitReportMutation();
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

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

  const handleLocationProcessingStateChange = (isProcessing) => {
    setIsProcessingLocation(isProcessing);
  };

  const isFormDisabled = isLoading || isProcessingLocation;

  return (
    <div>
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <form id="new-report-form" className="space-y-6" onSubmit={e => handleFormSubmit(e, formData, selectedImage)} encType="multipart/form-data" noValidate>
            <FormPopulateButton
              setFormData={setFormData}
              handleImageSelect={handleImageSelect}
            />

            <div className="mt-[0.5rem]">
              <p className="text-md text-gray-500 dark:text-gray-400">
                Use this form to report a lost or found pet in your area. Please include as many details
                as possible in the description, and upload your best photo of the animal.
              </p>
            </div>

            <BasicInfoFields
              formData={formData}
              onInputChange={handleInputChange}
              readOnly={isFormDisabled}
              error={""}
              descriptionError={""}
              dashboard
            />

            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview}
              disabled={isFormDisabled}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
              error={""}
              dashboard
            />

            <IdentificationFields
              formData={formData}
              onInputChange={handleInputChange}
              isLoading={isFormDisabled}
              error={""}
              breedError={""}
              alteredError={""}
              microchipError={""}
              dashboard
            />

            <ColorFields
              formData={formData}
              isLoading={isFormDisabled}
              handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
              handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
              handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
              error={""}
              dashboard
            />

            <ReportLocationSelect
              onLocationSelect={handleLocationUpdate}
              initialLocation={getInitialLocation()}
              isLoading={isLoading}
              error={""}
              onProcessingStateChange={handleLocationProcessingStateChange}
              dashboard
            />
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={(e) => handleFormSubmit(e, formData, selectedImage)}
                disabled={isFormDisabled}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isFormDisabled ? (
                  <div className="flex items-center">
                    <Spinner inline size={16} className="mr-2" color="text-white" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNewForm;
