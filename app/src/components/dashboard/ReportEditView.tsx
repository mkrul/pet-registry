import React from 'react';
import { ReportProps } from '../../types/Report';
import { useReportEdit } from '../../hooks/useReportEdit';
import EditReportForm from '../reports/forms/EditReportForm';
import Notification from '../common/Notification';
import { NotificationState } from '../../types/common/Notification';

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
    const result = await handleSaveChanges(e);
    if (result.success) {
      onSaveSuccess?.();
    }
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Report</h2>
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Back to Reports
        </button>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={onNotificationClose}
        />
      )}

      <div className="w-full mx-auto px-2">
        <EditReportForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleSaveChanges={handleSave}
          handleCancelChanges={handleCancel}
          isSaving={isSaving}
          imageSrc={imageSrc}
          handleImageLoad={handleImageLoad}
          handleImageError={handleImageError}
          handleLocationSelect={handleLocationSelect}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          getFilteredBreedOptions={getFilteredBreedOptions}
          colorOptions={colorOptions}
          getFilteredColorOptions={getFilteredColorOptions}
          genderOptions={genderOptions}
          VIEW_ZOOM_LEVEL={VIEW_ZOOM_LEVEL}
        />
      </div>
    </div>
  );
};

export default ReportEditView;
