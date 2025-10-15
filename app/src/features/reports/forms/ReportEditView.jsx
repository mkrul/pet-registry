import React, { useState } from 'react';
import { useReportEdit } from '../../../shared/hooks/useReportEdit.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../../../shared/components/common/Spinner.jsx';
import { BasicInfoFields } from '../../listings/components/common/BasicInfoFields.jsx';
import { IdentificationFields } from '../../listings/components/common/IdentificationFields.jsx';
import { ColorFields } from '../../listings/components/common/ColorFields.jsx';
import { ImageUpload } from '../../listings/components/common/ImageUpload.jsx';
import { LocationSelect } from '../../listings/components/common/LocationSelect.jsx';
import DateDisplay from '../../listings/components/common/DateDisplay.jsx';
import { createMapLocation } from '../../../shared/utils/mapUtils.js';

const ReportEditForm = ({
  report,
  onBack,
  onSaveSuccess
}) => {
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

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
    handleLocationSelect,
    getFilteredBreedOptions,
    getFilteredColorOptions
  } = useReportEdit(report);

  const isFormDisabled = isSaving || isProcessingLocation;

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await handleSaveChanges(e);
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

          <LocationSelect
            onLocationSelect={handleLocationSelect}
            initialLocation={createMapLocation({
              latitude: formData.latitude ?? 0,
              longitude: formData.longitude ?? 0,
              area: formData.area ?? "",
              state: formData.state ?? "",
              country: formData.country ?? "",
              intersection: formData.intersection ?? ""
            })}
            isLoading={isSaving}
            required={false}
            onProcessingStateChange={handleLocationProcessingStateChange}
          />

          <DateDisplay createdAt={formData.createdAt ?? ""} updatedAt={formData.updatedAt ?? ""} />
        </form>
      </div>
    </div>
  );
};

export default ReportEditForm;
