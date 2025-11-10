import React, { useState } from 'react';
import { useReportEdit } from '../../../shared/hooks/useReportEdit.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../../../shared/components/common/Spinner.jsx';
import FormLayout from '../../../shared/components/common/FormLayout.jsx';
import { BasicInfoFields } from '../../listings/components/common/BasicInfoFields.jsx';
import { IdentificationFields } from '../../listings/components/common/IdentificationFields.jsx';
import { ColorFields } from '../../listings/components/common/ColorFields.jsx';
import { ImageUpload } from '../../listings/components/common/ImageUpload.jsx';
import { ReportLocationSelect } from '../components/ReportLocationSelect.jsx';
import AssociatedRecordUpdateModal from '../../../shared/components/common/AssociatedRecordUpdateModal.jsx';

const ReportEditForm = ({
  report,
  onBack,
  onSaveSuccess
}) => {
  const {
    formData,
    isSaving,
    imageSrc,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    handleLocationSelect,
    showConfirmModal,
    handleConfirmSave,
    handleCancelSave
  } = useReportEdit(report);

  const handleSave = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    const result = await handleSaveChanges(
      e || { preventDefault: () => {} }
    );

    if (result.success) {
      onSaveSuccess?.(result.success);
    }
  };

  const handleConfirmAndSave = async () => {
    const result = await handleConfirmSave();
    if (result.success) {
      onSaveSuccess?.(result.success);
    }
  };

  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

  const handleLocationProcessingStateChange = (isProcessing) => {
    setIsProcessingLocation(isProcessing);
  };

  const isFormDisabledWithLocation = isSaving || isProcessingLocation;

  const handleLocationUpdate = (location) => {
    handleLocationSelect(location);
  };

  const SaveButtonContent = () => (
    isSaving ? (
      <div className="flex items-center">
        <Spinner inline size={16} className="mr-2" color="text-white" />
        Saving...
      </div>
    ) : (
      <>
        <FontAwesomeIcon icon={faSave} className="mr-2" />
        Save
      </>
    )
  );

  return (
    <FormLayout
      title="Edit Report"
      primaryAction={{
        label: <SaveButtonContent />,
        onClick: handleSave,
        disabled: isFormDisabledWithLocation,
        className: "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      }}
      secondaryAction={{
        label: "Back to Reports",
        onClick: onBack,
        className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
      }}
      formWrapperClassName="w-full"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <form id="edit-report-form" className="space-y-6" onSubmit={handleSave} encType="multipart/form-data" noValidate>
          <div className="mt-[0.5rem]">
            <p className="text-md text-gray-500 dark:text-gray-400">
              Use this form to report a lost or found pet in your area. Please include as many details
              as possible in the description, and upload your best photo of the animal.
            </p>
          </div>
          <BasicInfoFields
            formData={formData}
            onInputChange={handleInputChange}
            readOnly={isFormDisabledWithLocation}
            error=""
            descriptionError=""
            dashboard
          />

          <ImageUpload
            onFileChange={handleFileChange}
            preview={imageSrc}
            disabled={isFormDisabledWithLocation}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            error=""
            dashboard
          />

          <IdentificationFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isFormDisabledWithLocation}
            error=""
            breedError=""
            alteredError=""
            microchipError=""
            dashboard
          />

          <ColorFields
            formData={formData}
            isLoading={isFormDisabledWithLocation}
            handleColor1Change={(value) => handleInputChange({ target: { name: "color1", value } })}
            handleColor2Change={(value) => handleInputChange({ target: { name: "color2", value } })}
            handleColor3Change={(value) => handleInputChange({ target: { name: "color3", value } })}
            error=""
            dashboard
          />

          <ReportLocationSelect
            onLocationSelect={handleLocationUpdate}
            initialLocation={formData}
            isLoading={isSaving}
            error=""
            onProcessingStateChange={handleLocationProcessingStateChange}
            dashboard
          />
        </form>
      </div>

      <AssociatedRecordUpdateModal
        isOpen={showConfirmModal}
        onClose={handleCancelSave}
        onConfirm={handleConfirmAndSave}
        recordType="report"
        isLoading={isSaving}
      />
    </FormLayout>
  );
};

export default ReportEditForm;
