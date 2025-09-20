import React from 'react';
import { ReportProps } from '../../types/Report';
import { useReportEdit } from '../../hooks/useReportEdit';
import Notification from '../common/Notification';
import { NotificationState } from '../../types/common/Notification';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../common/Spinner';
import { BasicInfoFields } from '../reports/common/BasicInfoFields';
import { IdentificationFields } from '../reports/common/IdentificationFields';
import { ColorFields } from '../reports/common/ColorFields';
import { ImageUpload } from '../reports/common/ImageUpload';
import { LocationSelect } from '../reports/common/LocationSelect';
import DateDisplay from '../reports/common/DateDisplay';
import { createMapLocation } from '../../utils/mapUtils';

interface ReportEditViewProps {
  report: ReportProps;
  onBack: () => void;
  onSaveSuccess?: () => void;
  notification?: NotificationState | null;
  onNotificationClose?: () => void;
}

const ReportEditView: React.FC<ReportEditViewProps> = ({
  report,
  onBack,
  onSaveSuccess,
  notification,
  onNotificationClose
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
    handleLocationSelect,
    getFilteredBreedOptions,
    getFilteredColorOptions
  } = useReportEdit(report);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSaveChanges(e);
    if (result.success) {
      onSaveSuccess?.();
    }
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

      {notification && onNotificationClose && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={onNotificationClose}
        />
      )}

      <div className="w-full mx-auto px-2">
        <form id="edit-report-form" className="space-y-4">
          <BasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isSaving} />

          <ImageUpload
            onFileChange={handleFileChange}
            preview={imageSrc}
            disabled={isSaving}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            required={false}
          />

          <IdentificationFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isSaving}
            error=""
          />

          <ColorFields
            formData={formData}
            isLoading={isSaving}
            handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
            handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
            handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
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
          />

          <DateDisplay createdAt={formData.createdAt ?? ""} updatedAt={formData.updatedAt ?? ""} />
        </form>
      </div>
    </div>
  );
};

export default ReportEditView;
