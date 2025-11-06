import React, { useState } from 'react';
import { useReportEdit } from '../../../shared/hooks/useReportEdit.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../../../shared/components/common/Spinner.jsx';
import { BasicInfoFields } from '../../listings/components/common/BasicInfoFields.jsx';
import { IdentificationFields } from '../../listings/components/common/IdentificationFields.jsx';
import { ColorFields } from '../../listings/components/common/ColorFields.jsx';
import { ImageUpload } from '../../listings/components/common/ImageUpload.jsx';
import DateDisplay from '../../listings/components/common/DateDisplay.jsx';
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
    speciesOptions,
    breedOptions,
    colorOptions,
    genderOptions,
    VIEW_ZOOM_LEVEL,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    getFilteredBreedOptions,
    getFilteredColorOptions,
    showConfirmModal,
    handleConfirmSave,
    handleCancelSave
  } = useReportEdit(report);

  const isFormDisabled = isSaving;

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await handleSaveChanges(e);
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

  const handleLocationProcessingStateChange = (isProcessing) => {
    setIsProcessingLocation(isProcessing);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Report</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isSaving ? (
              <div className="flex items-center">
                <Spinner inline size={16} className="mr-2" color="text-white" />
                Saving...
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
              </>
            )}
          </button>
          <button
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Reports
          </button>
        </div>
      </div>

      <div className="w-full mx-auto px-2">
        <form id="edit-report-form" className="space-y-4">
          <BasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isFormDisabled} />

          <ImageUpload
            onFileChange={handleFileChange}
            preview={imageSrc}
            disabled={isFormDisabled}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            required={false}
          />

          <IdentificationFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isFormDisabled}
            error=""
          />

          <ColorFields
            formData={formData}
            isLoading={isFormDisabled}
            handleColor1Change={(value) => handleInputChange({ target: { name: "color1", value } })}
            handleColor2Change={(value) => handleInputChange({ target: { name: "color2", value } })}
            handleColor3Change={(value) => handleInputChange({ target: { name: "color3", value } })}
          />

          <DateDisplay createdAt={formData.createdAt ?? ""} updatedAt={formData.updatedAt ?? ""} />
        </form>
      </div>

      <AssociatedRecordUpdateModal
        isOpen={showConfirmModal}
        onClose={handleCancelSave}
        onConfirm={handleConfirmAndSave}
        recordType="report"
        isLoading={isSaving}
      />
    </div>
  );
};

export default ReportEditForm;
